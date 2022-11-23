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

function AggregatesPage(props:IProps) {
  const { } = props;

  const [error,setError ] = useState();
  const [text,setText ] = useState("");

  function remoteCall(methodName){
    Meteor.call(methodName,(err,res)=>{
      if(err){
        setError(error);
      }else {
        setText(JSON.stringify(res,null,2));
      }
    });
  }
  function handlePressRefresh(){
    remoteCall("monitor.topicAgg");
  }

  return (
    <Holder>
      <MenuBar />
      <hr/>
      <Button onClick={handlePressRefresh}>Refresh</Button>
      <hr />
      <pre>
        <StringInputHook value={text} onUpdate={setText} rows={20} />
      </pre>
    </Holder>
  );
}


export default AggregatesPage;
