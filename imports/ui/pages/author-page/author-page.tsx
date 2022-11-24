
import {AlignCenterRow} from "/imports/ui/common/AlignCenterRow";
import {MenuBar} from "/imports/ui/menu";
import {StringInputHook} from "/imports/ui/widget/inputs";
import {saveStringToFile} from "/imports/helper/IO";
import {Button} from "antd";
import React,{useState,useEffect} from 'react';
import styled from 'styled-components';
import { Meteor } from "meteor/meteor";


const Holder = styled.div`

`;

interface IProps {

}


function AuthorPage(props:IProps) {
  const { } = props;
  const [authorId,setAuthorId ] = useState('205034565');

  const [status,setStatus ] = useState();
  const [comments,setComments ] = useState();
  function handleClick(){
      Meteor.call('result.showAuthor',authorId,(err,res)=>{
        setStatus(res.status);
        setComments(res.comments)

      });
  }
  function saveStatus(){
    const fn=`${authorId}_status.json`;
    saveStringToFile(status,fn);
  }

  function saveComments(){
    const fn=`${comments[0].回覆者}_comments_[${comments.length}].json`;
    saveStringToFile(comments,fn);
  }

  return (
    <Holder>
      <MenuBar />
      <AlignCenterRow>
        <span>AuthorId</span>
        <StringInputHook value={authorId} onUpdate={setAuthorId} /> <Button type={"primary"} onClick={handleClick}>Submit</Button>
      </AlignCenterRow>
      <hr/>
      <AlignCenterRow>
        <Button onClick={saveStatus}>Save Status</Button>
        <Button onClick={saveComments}>Save Comments</Button>
      </AlignCenterRow>
      <pre>
        {JSON.stringify(status,null,2)}
      </pre>
      <pre>
        {JSON.stringify(comments,null,2)}
      </pre>
    </Holder>
  );
}


export default AuthorPage;
