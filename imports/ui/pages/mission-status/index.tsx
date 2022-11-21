
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
  function handlePressRefresh(){
    Meteor.call("mission.status",(err,res)=>{
      if(err){
        setError(error);
      }else {
        setData(res);
      }
    });
  }
  return (
    <Holder>
      <MenuBar />
      <PageHeader>
        Mission Status

      </PageHeader>
      <Button onClick={handlePressRefresh}>Refresh</Button>
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
