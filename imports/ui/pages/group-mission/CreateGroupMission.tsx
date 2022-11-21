
import {TopicLogApi} from "/imports/api/collections/TopicLogApi";
import {saveStringToFile} from "/imports/helper/IO";
import {StringHelper} from "/imports/helper/string-helpers";
import {MenuBar} from "/imports/ui/menu";
import GroupMissionEditor from "/imports/ui/pages/group-mission/GroupMissionEditor";
import {Button} from "antd";
import { Meteor } from 'meteor/meteor';
import moment from "moment";
import React,{useState,useEffect} from 'react';
import styled from 'styled-components';
import {CommonPageHolder} from "/imports/ui/common/container";

const Holder = styled(CommonPageHolder)`
  > .content {
    

  }
`;

interface IProps {

}

export function CreateGroupMission(props:IProps) {
  const { } = props;
  const [groups,setGroups ] = useState([]);
  const [result,setResult ] = useState([]);
  useEffect(()=>{
   // @ts-ignore
    Meteor.call('group.getGroups',(err,res)=>{
     setGroups(res);
   });
  },[]);



  function renderItems(){
    return groups.map((g)=>{
      const {id} = g;
      return (<GroupMissionEditor key={id} item={g} />);
    });
  }

  function processResult(ll){
    const newll = ll.map((l)=>{
      const {topicId} = l;
      if(StringHelper.isBlank(topicId)==false) {
        const topic = TopicLogApi.getByTopicId(topicId);
        if (topic) {
          const {topicLink,topicId} =topic;
          const link = `https://www.douban.com/group/topic/${topicId}/`;
          return {
            topicLink: link,
            ...l,
            topicCreator: topic.peopleName,
            topicLastReply: moment(topic.timestamp).format("YYYY-MM-DD HH:mm")
            timestamp:topic.timestamp
          }
        }else {
          const {topicId} = l;
          const link = `https://www.douban.com/group/topic/${topicId}/`;

          return {
            topicLink: link,
            ...l,
          }
        }
      }
      return l;
    });
    return newll;
  }

  function doExport(){
    Meteor.call('doExport',(err,res)=>{
      debugger
      const ll = JSON.parse(res);// [...res];//processResult(res);

      ll.sort((a,b)=>{
        const aa = a.pubTimeStr;
        const bb = b.pubTimeStr;
        return bb.localeCompare(aa);
      });

      const ll2=ll.map((r,index)=>{
        const {
          pubTime,createdAt,_id,_class,
          peopleName,peopleId,replyContent,
          pubTimeStr,
          groupId,groupName,topicTitle,topicId,topicLink,topicCreatorId
          topicCreator,toGetGroup,
          ...rest
        } = r;
        return {
          '#':index+1,
          'ReplyPubTime':pubTimeStr,
          groupName,
          "樓主":topicCreator,
          topicTitle,
          'replier':peopleName,
          replyContent,
          topicLink,
          groupId,
          topicId,
          '樓主Id':topicCreatorId,
          'replierId':peopleId,
          ...rest
        }
      });
      setResult(ll2);
      saveStringToFile(ll2,'douban.json');
    });
  }
  return (
    <Holder>
      <MenuBar/>
      <Button onClick={doExport}>Export</Button>
      {result.length}
      <pre>
        {JSON.stringify(result,null,2)}
      </pre>
      <div className={"content"}>
        {renderItems()}
      </div>
    </Holder>
  );
}



