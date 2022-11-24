import {AlignCenterRow} from "/imports/ui/common/AlignCenterRow";
import {MenuBar} from "/imports/ui/menu";
import {StringInputHook} from "/imports/ui/widget/inputs";
import {Button} from "antd";
import {Meteor} from "meteor/meteor";

import React,{useState,useEffect} from 'react';
import styled from 'styled-components';



const Holder = styled.div`

`;

interface IProps {

}

function StatusPage(props:IProps) {
  const { } = props;
  const [statusId,setStatusId ] = useState();
  const [result,setResult ] = useState();
  function handleClick(){
    Meteor.call('result.status',statusId,(err,res)=>{
      setResult(res);
    });

  }
  return (
    <Holder>
      <MenuBar />
      <AlignCenterRow>
        <span>AuthorId</span>
        <StringInputHook value={statusId} onUpdate={setStatusId} /> <Button type={"primary"} onClick={handleClick}>Submit</Button>
      </AlignCenterRow>
      <hr/>
      <pre>
        {JSON.stringify(result,null,2)}
      </pre>
    </Holder>
  );
}


export default StatusPage;
