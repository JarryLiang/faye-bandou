import {StringHelper} from "/imports/helper/string-helpers";
import {showMsg} from "/imports/ui/common/antd-wrap";
import {MenuBar} from "/imports/ui/menu";
import {StringInputHook} from "/imports/ui/widget/inputs";
import {Button, PageHeader} from "antd";
import React,{useState,useEffect} from 'react';
import styled from 'styled-components';
import { Meteor } from "meteor/meteor";

import {saveStringToFile} from "/imports/helper/IO";
import set = Session.set;


const Holder = styled.div`

`;

interface IProps {

}

function MigrateToRemote(props:IProps) {
  const { } = props;

  const [data,setData ] = useState({});
  const [text,setText ] = useState("");

  function handlePressDownloadTopic(){
    const excludeCids = {
       "1029":true, //2
       "1041":true, //game
      //"4":true, //camera
      //"17":true, //song
      //"3":true, //tech
      //"14":true //plant
    }


    Meteor.call("mission.downloadTopics",(err,res)=>{
      setData(res);
      debugger
      const {topics} = res;
      const ts=topics.filter((r)=>{
        const {exclude,cid,priori} = r;
        if(exclude){
          return false;
        }
        if(priori<0){
          return false;
        }
        if(cid){
          if(excludeCids[cid]){
            return true;
          }

        }
        return false;

        return true;
      });

      const result ={
        ...res,
        count:ts.length,
        topics:ts
      }

      saveStringToFile(result,"topics.json");
    });
  }
  function handlePressUpload(){
    if(StringHelper.isBlank(text)){
      return
    };
    Meteor.call("mission.uploadTopics",text,(err,res)=>{
      showMsg(res);
      setText("")
    });
  }
  return (
    <Holder>
      <MenuBar />
      <PageHeader >
        Migrate to Remote
      </PageHeader>
      <hr/>
      <Button type={"primary"}
              onClick={handlePressDownloadTopic} > Download Gallery Topics</Button>
      <hr/>
      <div>Topic Upload</div>
      <StringInputHook value={text} onUpdate={setText} rows={8} />
      <br/>
      <Button onClick={handlePressUpload}>Upload</Button>


    </Holder>
  );
}


export default MigrateToRemote;
