import {ICreateMissionParam} from "/imports/api/collections/GroupMissionApi";
import {AlignCenterRow} from "/imports/ui/common/AlignCenterRow";
import {NumberInputHook} from "/imports/ui/widget/inputs";
import {MultiTagOnOff} from "/imports/ui/widget/MultiTagOnOff";
import {Button} from "antd";
import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import { Meteor } from "meteor/meteor";


const Holder = styled.div`
  margin: 8px;
  padding: 4px;
  border: solid 1px #CCC;

  > .row1 {
    align-items: center;
    display: grid;
    grid-template-columns: 100px 200px 1fr;
    grid-gap: 10px;
    margin-bottom: 4px;
  }

  > .row2 {
    align-items: center;
    display: grid;
    grid-template-columns: 140px 40px 80px 40px 80px 100px 1fr;
    >span {
      text-align: center;
    }
    grid-gap: 20px;
  }
`;


interface IProps {
  item: any
}

const items = [
  "new", "essence"
]

function GroupMissionEditor(props: IProps) {
  const {item} = props;
  const [type, setType] = useState("new");
  const [start, setStart] = useState(1);
  const [end, setEnd] = useState(9);
  const [missionMap,setMissionMap ] = useState({});
  const [timeStamp,setTimeStamp ] = useState(Date.now);

  useEffect(()=>{
    Meteor.call('groupmission.fetch',(err,res)=>{

    });
  },[timeStamp]);

  function handlePressCreate(){
    const data:ICreateMissionParam = {
      groupId:item.id,
      type,
      start,
      end,
      force:false
    }
    Meteor.call('groupmission.create',data);
    setTimeout(()=>{
      setTimeStamp(Date.now);
    },2000);
  }
  return (
    <Holder>
      <div className={"row1"}>
        <div>{item.id}</div>
        <div>{item.name}</div>
        <div/>
      </div>
      <div className={"row2"}>
        <MultiTagOnOff items={items} value={type} onUpdate={setType} single={true}/>
        <span>
          from
        </span>
        <NumberInputHook value={start} onUpdate={setStart} />
        <span>
          to
        </span>
        <NumberInputHook value={end} onUpdate={setEnd} />
        <Button onClick={handlePressCreate}>Create</Button>
      </div>

    </Holder>
  );
}


export default GroupMissionEditor;
