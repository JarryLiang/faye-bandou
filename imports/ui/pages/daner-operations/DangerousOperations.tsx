import {AlignCenterRow} from "/imports/ui/common/AlignCenterRow";
import {showErr, showMsg} from "/imports/ui/common/antd-wrap";
import {MenuBar} from "/imports/ui/menu";
import {Button} from "antd";
import React,{useState,useEffect} from 'react';
import styled from 'styled-components';
import { Meteor } from "meteor/meteor";


const Holder = styled.div`

`;

interface IProps {

}

function DanerousOperations(props:IProps) {
  const { } = props;

  function onClickReset(){
    Meteor.call("dangerous.resetTopicHandled",(err,res)=>{
      if(err){
        showErr(err);
      }else {
        showMsg("Operation completed");
      }

    });
  }

  return (
    <Holder>
      <MenuBar />
      <AlignCenterRow>
        <Button type={"primary"} onClick={onClickReset}> Reset Topic Handle</Button>
      </AlignCenterRow>

    </Holder>
  );
}


export default DanerousOperations;
