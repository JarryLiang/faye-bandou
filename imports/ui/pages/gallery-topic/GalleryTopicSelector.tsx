import GalleryTopicAdd from "/imports/ui/component/GalleryTopicAdd";
import {MenuBar} from "/imports/ui/menu";
import {StringInputHook} from "/imports/ui/widget/inputs";
import {Button, Table, Tabs} from "antd";
import {Meteor} from 'meteor/meteor';
import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import {Checkbox, InputNumber} from 'antd';
import type {CheckboxValueType} from 'antd/es/checkbox/Group';

const {TabPane} = Tabs;
import {saveStringToFile} from "/imports/helper/IO";
import set = Session.set;

const Holder = styled.div`

`;

interface IProps {

}


function hasKeywords(name: string, ks: any[]) {
  let rr = false;
  ks.forEach((k) => {
    if (name.indexOf(k) >= 0) {
      rr = true;
    }
  });
  return rr;
}

function GalleryTopicSelector(props: IProps) {
  const {} = props;

  const [records, setRecords] = useState([]);
  const [keywords, setKeywords] = useState("");
  const [remainRecords, setRemainRecords] = useState([]);
  const [enableFilter, setEnableFilter] = useState(false);

  useEffect(() => {
    if (!enableFilter) {
      setRemainRecords([...records]);
      return;
    }
    const ss = keywords.trim().split(" ");

    const ks = [];
    ss.forEach((s) => {
      if (s.length > 0) {
        ks.push(s);
      }
    });

    const rr = records.filter((r) => {
      return hasKeywords(r.name, ks);
    });
    setRemainRecords(rr);
  }, [records, enableFilter, keywords]);

  useEffect(() => {
    const v = localStorage.getItem("KK") || "";
    setKeywords(v);
  }, []);


  function updateKeywords(v) {
    localStorage.setItem("KK", v);
    setKeywords(v);
  }

  function loadTodoGallery() {
    Meteor.call("getGalleryTopics", (err, res) => {
      const data = JSON.parse(res);
      setRecords(data);
      setRemainRecords(data);
    })

  }

  useEffect(() => {
    loadTodoGallery();

  }, [])

  function updatePriori(record, priori) {
    const newRecord = {
      ...record,
      priori
    }
    Meteor.call("updateGalleryTopic", newRecord, (err, res) => {
    });
    const newRecords = records.map((r) => {
      if (record._id === r._id) {
        return newRecord;
      } else {
        return r;
      }
    });
    setRecords(newRecords);
  }

  function updateExclude(record, exclude) {
    const newRecord = {
      ...record,
      exclude
    }
    Meteor.call("updateGalleryTopic", newRecord, (err, res) => {
    });
    const newRecords = records.map((r) => {
      if (record._id === r._id) {
        return newRecord;
      } else {
        return r;
      }
    });
    setRecords(newRecords);
  }

  function renderRecords() {

    const columns = [
      {
        title: 'exclude',
        dataIndex: 'exclude',
        width: 20,
        key: 'exclude',
        align: 'center',
        render: (value, record) => {
          return (<Checkbox checked={value}
                            onChange={(e) => {
                              updateExclude(record, e.target.checked);
                            }}></Checkbox>);
        }
      },
      {
        title: 'priori',
        dataIndex: 'priori',
        width: 100,
        key: 'priori',
        sorter: (a, b) => {
          return a.follow - b.follow;
        },
        render: (value, record) => {
          if (value != 0) {
            return (<InputNumber style={{color: "red", fontWeight: "bold", backgroundColor: "#CCC"}} min={-10} max={10}
                                 defaultValue={value}
                                 onChange={(e) => {
                                   updatePriori(record, e);
                                 }}/>);
          } else {
            return (<InputNumber min={-10} max={10} defaultValue={value}
                                 onChange={(e) => {
                                   updatePriori(record, e);
                                 }}/>);
          }

        }
      },

      {
        title: '_id',
        dataIndex: '_id',
        width: 80,
        key: '_id',
        render: (value, record) => {
          return (<span>{value}</span>);
        }
      },
      {
        title: 'name',
        dataIndex: 'name',
        width: 150,
        key: 'name',
        render: (value, record) => {
          return (<span>
            {value}
          </span>)
        }
      },
      {
        title: 'docs',
        dataIndex: 'docs',
        width: 50,
        key: 'docs',
        sorter: (a, b) => {
          return a.docs - b.docs;
        }
      },
      {
        title: 'join',
        dataIndex: 'join',
        width: 50,
        key: 'join',
        sorter: (a, b) => {
          return a.join - b.join;
        }
      },
      {
        title: 'follow',
        dataIndex: 'follow',
        width: 50,
        key: 'follow',
        sorter: (a, b) => {
          return a.follow - b.follow;
        }
      },

    ];

    return (<Table
      bordered
      size={"small"}
      pagination={{position: 'both', pageSize: 20}}
      dataSource={remainRecords}
      columns={columns}
      rowKey={(r) => {
        return r._id;
      }}
    />);

  }

  function handleExport() {
    const ll = [];
    records.forEach((r) => {
      const {_id, name, priori, exclude, updatedAt} = r;
      if (updatedAt != 0) {
        return;
      }
      if (exclude) {
        return;
      }
      if (priori < 1) {
        return;
      }
      ll.push(r);
    });

    ll.sort((a, b) => {
      return b.priori - a.priori;
    })

    const works = ll.map((r, index) => {
      return {
        topicId: r._id,
        fn: `z_${index}_${r._id}.json`,
        name: r.name
      }
    });
    saveStringToFile(works, "works.json");

    // {
    //   "cc": 24220,
    //   "topicId": "294793",
    //   "fn": "Z_004894_294793",
    //   "name": "最后的聊天记录"
    // },

  }

  function renderApply() {
    const text = enableFilter ? "Disable Filter" : "Enable Filter";
    return (<Button onClick={() => {
      setEnableFilter(!enableFilter)
    }}>{text}</Button>);
  }

  return (
    <Holder>
      <MenuBar/>

      <Tabs defaultActiveKey="1">
        <TabPane tab="Gallery Topic 過濾" key="1">
          <div>
            <Button onClick={handleExport}>Download Candidate</Button>
          </div>
          <StringInputHook value={keywords} onUpdate={updateKeywords}/>
          <div>
            {renderApply()}
          </div>
          <hr/>
          {renderRecords()}
        </TabPane>
        <TabPane tab="新增話題" key="2">
          <GalleryTopicAdd />
        </TabPane>
      </Tabs>
    </Holder>
  );
}


export default GalleryTopicSelector;
