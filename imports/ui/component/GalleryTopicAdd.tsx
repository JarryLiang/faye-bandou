import {StringHelper} from "/imports/helper/string-helpers";
import {showErr, showMsg} from "/imports/ui/common/antd-wrap";
import {NumberInputHook, StringInputHook} from "/imports/ui/widget/inputs";
import {Button} from "antd";

import React,{useState,useEffect} from 'react';
import styled from 'styled-components';
import { Meteor } from "meteor/meteor";



const Holder = styled.div`

`;

interface IProps {

}

function GalleryTopicAdd(props:IProps) {
  const { } = props;
  const [name,setName ] = useState("");
  const [topicId,setTopicId ] = useState("");
  const [docs,setDocs ] = useState(0);

  function handlePressAdd() {
    if(StringHelper.isBlank(name)){
      return;
    }
    if(StringHelper.isBlank(topicId)){
      return;
    }

    const data = {
      _id:topicId,
      topicId,
      name,
      docs,
    }

    Meteor.call("GalleryTopicApi.addTopic",data,(err,res)=>{
      if(err){
        showErr(err);
      }else {
        showMsg("Operation complete:"+res);
        setName("");
        setTopicId("");
        setDocs(0);
      }
    });
  }
  return (
    <Holder>
      <h3>新增話題</h3>
      <div>
        <span>Name</span>
        <StringInputHook  value={name} onUpdate={setName} />
      </div>
      <div>
        <span>Topic Id</span>
        <StringInputHook  value={topicId} onUpdate={setTopicId} />
      </div>
      <div>
        <span>Docs</span>
        <NumberInputHook onUpdate={setDocs} value={docs}/>
      </div>
      <div>
        <Button onClick={handlePressAdd}>Add</Button>
      </div>
    </Holder>
  );
}


export default GalleryTopicAdd;
