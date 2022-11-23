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

  const {browserStatus,error,running_mission,diffTime,complete} = data;

  function renderError(){
    if(error){
      const text=JSON.stringify(error);
      return (<div className={"error"}>
        {text}
      </div>);
    }
    return null;
  }
  function handlePressCopy(){
    StringHelper.copyTextToClipboard(address);
  }

  function renderBrowserStatus(){
    const clz = browserStatus!=='douban loaded'?"browser error":"browser";
    return (<div className={clz}>{browserStatus}</div>);
  }

  function renderDiffTime(){
    const d = Math.floor(diffTime/1000);
    return(<div>{`waiting ${d} sec`}</div>);
  }

  function renderComplete(){

    return <div>
      done:{complete?complete.length:"N/A"}
    </div>

  }

  return (
    <Holder>
      <div className={"mission-type"}>{running_mission}</div>
      <div className={"header"}>{address}
      <span className={"copy"} onClick={handlePressCopy}>COPY</span>
      </div>
      {renderBrowserStatus()}
      {renderError()}
      {renderDiffTime()}
      {renderComplete()}
    </Holder>
  );
}


export default Ec2StatusCard;
