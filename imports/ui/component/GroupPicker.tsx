
import {Button} from "antd";
import React,{useState,useEffect} from 'react';
import styled from 'styled-components';
import DoubanGroupView from "/imports/ui/component/DoubanGroupView";
import {Meteor} from "meteor/meteor";


const Holder = styled.div`

`;

const GroupsHolder =styled.div`
  width: 100%;;
  display: flex;
  flex-wrap: wrap; 
  flex-direction: row;  
  
`;


interface IProps {
  onSelect:(group:any)=>void;
  groupSize:any;
  replyCounts:any;
}

function GroupPicker(props:IProps) {
  const { onSelect,groupSize,replyCounts } = props;
  const [groups,setGroups ] = useState({});
  const [sortedGroup,setSortedGroup ] = useState([]);

  useEffect(()=>{
    if(Object.keys(replyCounts||{})==0){
      return;
    }
    const ll=Object.keys(groups).map((k)=>{
      return groups[k];
    })
    ll.sort((a,b)=>{
      const v1=replyCounts[a.id]||0;
      const v2=replyCounts[b.id]||0;
      return v2-v1;
    });
    setSortedGroup(ll);

  },[groups,replyCounts]);

  function loadGroups(){
    Meteor.call("group.getGroupsMap",(err,res)=>{
      setGroups(res);
    });
  }
  useEffect(()=>{
    loadGroups();
  },[]);

  function handleClick(g){
    onSelect(g);
  }


  function renderGroups(){
    const rp = replyCounts || {};
    const views= Object.keys(sortedGroup).map((k)=>{

      const g = sortedGroup[k];

      const id = g.id;
      const rsz = rp[id] || 0;
      const sz = groupSize?groupSize[id]||"":"Loading";
      return (
        <DoubanGroupView group={g} key={k} onClick={handleClick} count={sz} rSize={rsz}/>
      )
    });
    return (<GroupsHolder>
      <Button type={"primary"} onClick={loadGroups}>Reload</Button>
      {views}
    </GroupsHolder>
  }

  return renderGroups();
}


export default GroupPicker;
