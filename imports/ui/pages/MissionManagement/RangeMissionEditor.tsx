import {AlignCenterRow} from "/imports/ui/common/AlignCenterRow";
import {NumberInputHook, StringInputHook, SwitchInputHook} from "/imports/ui/widget/inputs";
import {Button} from "antd";
import React,{useState,useEffect} from 'react';
import styled from 'styled-components';
import set = Session.set;
import { Meteor } from "meteor/meteor";


const Holder = styled.div`
  margin: 8px;
  padding: 8px;
  border-radius: 4px;
  border: solid 1px #CCC;
`;

interface IProps {
  mission:any;
  onUpdate:()=>void;
}

export function RangeMissionEditor(props:IProps) {
  const {
    mission,onUpdate
  } = props;
  const [status,setStatus ] = useState(mission.status);
  const [start,setStart ] = useState(mission.start);
  const [end,setEnd ] = useState(mission.end);
  const [pass2,setPass2 ] = useState(mission.pass2);

  function handlePressUpdate() {
    const r = {
      ...mission,
      pass2,
      start,
      end,
      status
    }
    Meteor.call('grouprangemission.update',r,(err,res)=>{
      onUpdate();
    });
  }

  return (
    <Holder>
      <AlignCenterRow>
        <span>[{mission._id}]</span><span>GroupId:</span><div >{mission.groupId}</div>
      </AlignCenterRow>
      <AlignCenterRow>
        <span>Pass2</span>
        <SwitchInputHook checked={pass2} onChange={setPass2} />
      </AlignCenterRow>
      <AlignCenterRow>
        <span>Start</span><NumberInputHook value={start} onUpdate={setStart} />
      </AlignCenterRow>
      <AlignCenterRow>
        <span>End</span> <NumberInputHook value={end} onUpdate={setEnd} />
      </AlignCenterRow>
      <AlignCenterRow>
        <span>Latest</span><span>{mission.latest}</span>  <span>Status</span><StringInputHook value={status} onUpdate={setStatus}/> <Button onClick={handlePressUpdate}>Update</Button>
      </AlignCenterRow>
    </Holder>
  );
}

