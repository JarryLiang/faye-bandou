import {showErr, showMsg} from "/imports/ui/common/antd-wrap";
import {MenuBar} from "/imports/ui/menu";
import {StringInputHook} from "/imports/ui/widget/inputs";
import {Button, PageHeader, Tabs} from "antd";
import React,{useState,useEffect} from 'react';
import styled from 'styled-components';
import set = Session.set;
import { Meteor } from "meteor/meteor";
import {find} from "styled-components/test-utils";
import sample from "./sample.json";

const { TabPane } = Tabs;
const Holder = styled.div`
  .cards-holder {
    display: grid;
    grid-template-columns: repeat(auto-fit,minmax(300px,36px));
    grid-gap: 10px;
    >div {
      margin: 4px;
      border-radius: 8px;
      border: solid 1px #CCC;
      padding: 4px;
    }
  }
`;

import Ec2StatusCard from "/imports/ui/pages/monitor-aws-page/Ec2StatusCard";

interface IProps {

}

function MonitorAWSPage(props:IProps) {
  const { } = props;
  const [text,setText ] = useState("");
  const [addresses,setAddresses ] = useState([]);
  const [status,setStatus ] = useState([]]);

  const toSKIP ="ec2-3-1-209-170.ap-southeast-1.compute.amazonaws.com";
  useEffect(()=>{
    const lines =text.split("\n");
    const ll:string[] = [];
    lines.forEach((l)=>{
      if(l.endsWith("compute.amazonaws.com")){
        const ad =l.trim();
        if(ad!==toSKIP){
          ll.push(ad);
        }
      }
    });
    setAddresses(ll);
  },[text]);

  function doSubmitAddress(){
    if(addresses.length>0){
      Meteor.call("aws.uploadAddresses",addresses,(err,res)=>{
        if(err){
          showErr(err);
        }else {
          showMsg(res);
        }
      });
    }
  }
  function doFetchStatus(){
    setStatus([]);
    Meteor.call("aws.status",addresses,(err,res)=>{
      if(err){
        showErr(err);
      }else {
        setStatus(res);
      }
    });
  }


  function renderAllStatusGroup(ss){
    const views=ss.map((item)=>{
      const {address,data} = item;
      return(<Ec2StatusCard key={address} item={item}/>);
    });
    return views;
  }
  function renderAllStatus(){
    const groups =status.reduce((cc,item)=>{
      const {address,data} = item;
      if(data){
        const {running_mission} = data;
        if(running_mission==='comment'){
          cc.comment.push(item);
          return cc;
        }
        if(running_mission==='status'){
          cc.status.push(item);
          return cc;
        }
        cc.unknown.push(item);
        return cc;
      }else {
        cc.unknown.push(item);
        return cc;
      }
    },{status:[],comment:[],unknown:[]});


    return (<div>
      <div className={"cards-holder"}>
        {renderAllStatusGroup(groups.status)}
      </div>
      <div className={"cards-holder"}>
        {renderAllStatusGroup(groups.comment)}
      </div>
      <div className={"cards-holder"}>
        {renderAllStatusGroup(groups.unknown)}
      </div>
    </div>);
  }

  return (
    <Holder>
      <MenuBar />
      <PageHeader>
        Monitor AWS
      </PageHeader>
          <Tabs defaultActiveKey="1">
            <TabPane tab="Monitor" key="1">
              <Button type={"primary"} onClick={doFetchStatus}>Refresh</Button>
                {renderAllStatus()}
            </TabPane>
            <TabPane tab="Upload Address" key="2">
              <StringInputHook value={text} onUpdate={setText} rows={10} />
              <hr/>
              <Button onClick={doSubmitAddress}>Submit</Button>
              <pre>
                {JSON.stringify(addresses,null,2)}
              </pre>
            </TabPane>
          </Tabs>
    </Holder>
  );
}


export default MonitorAWSPage;
