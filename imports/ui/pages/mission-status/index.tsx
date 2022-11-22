
import {AlignCenterRow} from "/imports/ui/common/AlignCenterRow";
import {MenuBar} from "/imports/ui/menu";
import {Button, PageHeader} from "antd";
import React,{useState,useEffect} from 'react';
import styled from 'styled-components';
import { Meteor } from "meteor/meteor";

const Holder = styled.div`

`;

interface IProps {

}

function MissionStatus(props:IProps) {
  const { } = props;

  const [data,setData ] = useState({});
  const [error,setError ] = useState();
  function remoteCall(methodName){
    Meteor.call(methodName,(err,res)=>{
      if(err){
        setError(error);
      }else {
        setData(res);
      }
    });
  }
  function handlePressRefresh(){
    remoteCall("mission.status");
  }
  function handlePressAgg(){
    remoteCall("mission.statusAgg");
  }

  function handlePressTarget(){
    remoteCall("mission.showTarget");
  }
  function handlePressClearPick(){
    remoteCall("mission.clearPick");
  }
  function handlePressStatusLog(){
    remoteCall("mission.statusLog");
  }

  function handlePressCommentsLog(){
    remoteCall("mission.commentLog");
  }

  return (
    <Holder>
      <MenuBar />
      <PageHeader>
        Mission Status
      </PageHeader>
      <AlignCenterRow>
        <Button onClick={handlePressRefresh}>Refresh statistic</Button>
        <Button onClick={handlePressStatusLog}>Status Log</Button>
        <Button onClick={handlePressCommentsLog}>Comments Log</Button>
        <Button onClick={handlePressClearPick}>清除Pick</Button>
        <Button onClick={handlePressAgg}>Refresh Aggregate Status by Topic</Button>
        <Button onClick={handlePressTarget}>仙女不講李</Button>
      </AlignCenterRow>
      <hr/>
      <pre>
        {JSON.stringify(data,null,2)}
      </pre>
      <hr/>
      {JSON.stringify(error,null,2)}
    </Holder>
  );
}


export default MissionStatus;
