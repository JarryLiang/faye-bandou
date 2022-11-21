import React,{useState,useEffect} from 'react';
import styled from 'styled-components';



const GroupHolder =styled.div`
  margin: 8px;
  border: 1px #CCC solid;
  padding: 8px;
  border-radius: 4px;
  display: inline-block;
  font-size: 14px;
`;

interface IProps {
  group:any;
  onClick:(group:any)=>void;
  count:any;
  rSize:any;
}


function DoubanGroupView(props:IProps) {
  const {onClick,count,rSize} = props;
  const {id,name} = props.group;

  function handleClick(){
    onClick(props.group);
  }

  function openGroup(){
    const url=`https://www.douban.com/group/${id}/?ref=sidebar`;
    window.open(url,"_blank");
  }
  return (
    <GroupHolder onClick={handleClick}>
      <div><span style={{fontWeight:"bold"}}>{count}:({rSize}):</span><span style={{cursor:"pointer"}} onClick={openGroup}>{name}</span></div>
      <div>{id}</div>
    </GroupHolder>
  );
}


export default DoubanGroupView;
