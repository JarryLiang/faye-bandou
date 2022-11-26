import {StringHelper} from "/imports/helper/string-helpers";
import PropTypes from 'prop-types';
import React,{useState,useEffect} from 'react';
import styled from 'styled-components';
import OmHelper from 'client/OmHelper';
import classNames from 'classnames';

import {
  Button, message, JsonTabSwitchView, Icon, showErr, tryCall, showMsg,
} from 'components/ui-elements';


interface Current {
  current: string;
  status: string;
  comments_count: number;
  step?: number;
  job: string;
  timeOut?: boolean;
}

interface Error {
  name: string;
}

interface Data {
  browserStatus: string;
  running_mission: string;
  missionPause: boolean;
  count: number;
  current: Current;
  error: Error;
  timeStr: Date;
  now: any;
  time: any;
  diffTime?: number;
  complete: string[];
}

export interface TItem {
  address: string;
  data: Data;
}



const Holder = styled.div`
  padding: 4px;
  div {
    &.w30 {
      background-color: #FAA;
      color: white;
    }
    &.w60 {
      background-color: #F00;
      color: white;
    }
    &.w100 {
      background-color: #A00;
      color: white;
    }
  }
  .copy {
    cursor: pointer;
    border: solid 1px #CCC;
    padding: 0px 4px 0px 4px;
    text-align: center;
    margin: 0px 4px 0px 4px;
  }
  >.browser {
    background-color: blue;
    color: white;
    padding: 4px;
    &.error {
      background-color: crimson;
    }
  }
  >.mission-type {
    word-break: break-all;
    padding: 4px;
    background-color: slateblue;
    margin-bottom: 4px;
    color: white;
    font-weight: bold;
  }
  >.header {
    padding: 4px;
  }
  >.error {
    background-color: crimson;
    color: #FFF;
    padding: 4px;
  }
  
`;

interface IProps {
  item:TItem
}

function Ec2StatusCard(props:IProps) {
  const { item } = props;
  const {address}= item;

  const data = item.data || {};

  const {browserStatus,error,running_mission,diffTime,complete,browserAllocate,status_index_in_loop,count} = data;
  const {errorPeak,errors,zeroComments}=data;

  function renderError(){
    if(error){
      const text=JSON.stringify(error);
      return (<div className={"error"}>
        {text}
      </div>);
    }
    return null;
  }
  function renderErrors(){
    if(errors && errors.length>0){
      const text=JSON.stringify(errors);
      return (<div className={"errors"}>
        {text}
      </div>);
    }
    return null;
  }
  function handlePressCopy(){
    StringHelper.copyTextToClipboard(address);
  }

  function renderBrowserStatus(){
    const clz = browserStatus!=='script injected'?"browser error":"browser";
    return (<div className={clz}>{browserStatus}</div>);
  }

  function renderDiffTime(){
    const d = Math.floor(diffTime/1000);
    let clz ="";
    if(d>30) {
      clz = "w30";
    }
    if(d>60) {
      clz = "w60";
    }
    if(d>100) {
      clz = "w100";
    }

    return(<div className={clz}>{`waiting ${d} sec`}</div>);
  }
  function renderStep(){
    const text=`${browserAllocate}-${status_index_in_loop}`
    return(
      <div>
      <div>Step: {text}</div>
      <div>count: {count}</div>
      </div>
    );
  }
  function renderComplete(){

    return <div>
      done:{complete?complete.length:"N/A"}
    </div>

  }

  function renderZeroComments() {
    let clz ="";
    if(zeroComments>2) {
      clz = "w30";
    }
    if(zeroComments>5) {
      clz = "w100";
    }
    return <div className={clz}>
      Zero Comments:{zeroComments}
    </div>

  }

  return (
    <Holder>
      <div className={"mission-type"}>{running_mission}</div>
      <div className={"header"}>{address}
      <span className={"copy"} onClick={handlePressCopy}>COPY</span>
      </div>
      {renderBrowserStatus()}
      <div>errorPeak: {errorPeak}</div>
      {renderZeroComments()}
      {renderDiffTime()}
      {renderError()}
      {renderStep()}
      {renderComplete()}
      <hr/>
      {renderErrors()}
    </Holder>
  );
}


export default Ec2StatusCard;
