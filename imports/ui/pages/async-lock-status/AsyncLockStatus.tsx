import {MenuBar} from "/imports/ui/menu";
import {Button, PageHeader} from "antd";
import {Header} from "antd/es/layout/layout";
import React,{useState,useEffect} from 'react';
import styled from 'styled-components';


const Holder = styled.div`

`;

interface IProps {

}

function AsyncLockStatus(props:IProps) {
  const { } = props;
  const [timestamp,setTimestamp ] = useState(0);;
  useEffect(()=>{

    const handler=setInterval(()=>{
      console.log(new Date());
      setTimestamp((new Date()).getTime());
    },1000);

    return ()=>{
      console.log("Clear Internal");
      clearInterval(handler);
    };

  },[]);
  return (
    <Holder>
      <MenuBar />
      <PageHeader>
        非同步鎖測試狀況
      </PageHeader>
      <div>{timestamp}</div>

      <div>
        <Button>Test1</Button>
      </div>
      <div>
        <Button>Test2</Button>
      </div>

      AsyncLockStatus
    </Holder>
  );}


export default AsyncLockStatus;
