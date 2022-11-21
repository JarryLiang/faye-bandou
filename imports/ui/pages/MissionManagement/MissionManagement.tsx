import {AlignCenterRow} from "/imports/ui/common/AlignCenterRow";
import {CommonPageHolder} from "/imports/ui/common/container";
import GroupPicker from "/imports/ui/component/GroupPicker";
import {MenuBar} from "/imports/ui/menu";
import {RangeMissionEditor} from "/imports/ui/pages/MissionManagement/RangeMissionEditor";
import {NumberInputHook, StringInputHook, SwitchInputHook} from "/imports/ui/widget/inputs";
import {Button} from "antd";
import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import {Meteor, Meteor} from "meteor/meteor";
import set = Session.set;


const Holder = styled(CommonPageHolder)`
  > .content {
    background-color: #00acff;

  }
`;

interface IProps {

}

function MissionManagement(props: IProps) {
  const {} = props;
  const [targetGroup, setTargetGroup] = useState(null);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(0);
  const [pass2, setPass2] = useState(false);
  const [groupMap, setGroupMap] = useState({});
  const [groupSize, setGroupSize] = useState({});
  const [essence,setEssence ] = useState(false);

  const [replyCounts,setReplyCounts ] = useState({});

  useEffect(()=>{
    Meteor.call('doGroupStatistic',(err,res)=>{
      const result = JSON.parse(res);
      setReplyCounts(result);
    });
  },[]);

  useEffect(()=>{

    Meteor.call('doMonthStatisc',(err,res)=>{
      const result = JSON.parse(res);
      console.log(result);
    });

  },[]);

  function loadAll() {

    Meteor.call('grouprangemission.getAll', (err, res) => {

      if (err) {
        return;
      }

      const mm = {}
      const jo = JSON.parse(res);
      jo.forEach((r) => {
        const {groupId} = r;
        if (!mm[groupId]) {
          mm[groupId] = [];
        }
        mm[groupId].push(r);
      });
      Object.keys(mm).forEach((groupId) => {
        mm[groupId].sort((a, b) => {
          const m1 = a.start < a.end ? start : end;
          const m2 = b.start < b.end ? start : end;
          return m1 - m2;
        });
      });

      const ms = {};
      Object.keys(mm).forEach((groupId) => {
        ms[groupId] = mm[groupId].length;
      });
      setGroupMap(mm);

      setGroupSize(ms);
    });
  }

  function reload() {
    loadAll();
  }

  useEffect(() => {
    reload();
  }, [targetGroup]);

  function handlePressCreate() {
    if (start == end) {
      alert("start = end");
      return;
    }
    if (!targetGroup) {
      return;
    }
    const type = essence?"essence":"new";
    Meteor.call('grouprangemission.create', targetGroup.id, start, end, pass2,type, (err, res) => {
      setStart(0);
      setEnd(0);
      setPass2(false);
      alert("Success");
    });

  }

  function renderCreator() {
    return (
      <div>
        <AlignCenterRow>
          <span>Start</span>
          <NumberInputHook value={start} onUpdate={setStart}/>
          <span>End</span>
          <NumberInputHook value={end} onUpdate={setEnd}/>
          <span>Pass2</span>
          <SwitchInputHook checked={pass2} onChange={setPass2}/>
        </AlignCenterRow>
        <AlignCenterRow>
          <span>Essence</span>
          <SwitchInputHook checked={essence} onChange={setEssence}/>
        </AlignCenterRow>
        <br/>
        <Button type={"primary"} onClick={handlePressCreate}>Create</Button>
      </div>
    );
  }

  function renderTarget() {
    if (targetGroup) {
      return <div>{targetGroup.id} - {targetGroup.name}</div>
    }
  }

  function renderMissions() {
    if (targetGroup) {
      const {id} = targetGroup;
      const missions = groupMap[id] || [];

      const views = missions.map((m) => {
        const {_id} = m;
        return (<RangeMissionEditor key={_id} mission={m} onUpdate={reload}/>);
      }, [])
      return views;
      return (<div>No missions</div>)
    }
    return (<div>Select group</div>);

  }

  return (
    <Holder>
      <MenuBar />
      <GroupPicker onSelect={setTargetGroup} groupSize={groupSize} replyCounts={replyCounts}/>
      <hr/>
      {renderTarget()}
      {renderCreator()}
      <hr/>
      {renderMissions()}
    </Holder>
  );
}


export default MissionManagement;
