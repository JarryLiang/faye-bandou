//

import {GroupApi} from "/imports/api/collections/GroupApi";
import {StringHelper} from "/imports/helper/string-helpers";
import {Mongo} from "meteor/mongo";

import {TopicLogApi} from "/imports/api/collections/TopicLogApi";
import moment from "moment";
//
// TopicLog

export const TopicReplyCollection = new Mongo.Collection("TopicReply");



function getByPeopleId(peopleId:string){
  return TopicReplyCollection.find({peopleId}).fetch();
}


function exportReplyWithTopic(peopleId:string){

  const ll:any[] = getByPeopleId(peopleId);
  const groupMap = GroupApi.getGroupMap();


  const topicMap:{

  } ={};

  ll.forEach((l)=>{
    const {topicId} = l;
    if(StringHelper.isBlank(topicId)){
      return;
    }
    topicMap[topicId]=true;
  });

  console.log("1");
  Object.keys(topicMap).forEach((t)=>{
    const topic =TopicLogApi.getByTopicId(t);
    topicMap[t]=topic;
    if(topic){
      const {groupId} = topic;
      if(groupMap[groupId]){
        topic.groupName = groupMap[groupId].name;
      }
    }

  });
  console.log("2");


  const newll = ll.map((l)=>{
    const {topicId} = l;
    if(StringHelper.isBlank(topicId)==false) {
      const topic = topicMap[topicId]; //TopicLogApi.getByTopicId(topicId);
      if (topic) {
        const {topicLink,topicId} =topic;
        const link = `https://www.douban.com/group/topic/${topicId}/`;
        const groupId = topic.groupId||l.groupId;
        const groupName = topic.groupName||l.groupName;
        const topicTitle = l.topicTitle || topic.title;
        return {
          topicLink: link,
          ...l,
          groupId,groupName,
          topicTitle,
          topicCreator: topic.peopleName,
          topicCreatorId: topic.peopleId,
          topicLastReply: moment(topic.timestamp).format("YYYY-MM-DD HH:mm"),
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
  console.log("3");
  return newll;
}


async function queryByPeriod(period,start,end){
  const pipeline = [
    {
      $match:{
        $and:[{topicTime:{$gt:start}},{topicTime:{$lt:end}}]
      }
    },
    {
      $group:{
        _id:"$groupId",
        count:{$sum:1}
      }
    }
  ];
  const ll=await TopicReplyCollection.rawCollection().aggregate(pipeline).toArray();
  return {
    time:period,
    list:ll,
  };

}
async function doMonthStatisc(){
  let start = moment(new Date('2021-03-01').getTime());
  let end = moment(new Date('2021-04-01').getTime());

  const ps =[];
  for(let i=0;i<20;i++){
    ps.push(queryByPeriod(start.format("YYYY/MM"),start.toDate().getTime(),end.toDate().getTime());
    start=start.add(1,"month");
    end=end.add(1,"month");
  }

  const values= await Promise.all(ps);

  const result = {};
  values.forEach((m)=>{
    const {time,list} =m;
    list.forEach((r)=>{
      const {_id,count}=r;
      if(!result[_id]){
        result[_id]=[];
      }
      result[_id].push({
        time,
        count
      });
    });
  });

  return result;


}
async function doGroupReplyCount(){
  const pipeline = [
    {
      $group:{
        _id:"$groupId",
        count:{$sum:1}
      }
    },
    {
      $sort:{count:-1}
    }
  ];
  const ll =await TopicReplyCollection.rawCollection().aggregate(pipeline).toArray();
  return ll;

}
export const TopicReplyApi = {
  getByPeopleId,
  exportReplyWithTopic,
  doGroupReplyCount,
  doMonthStatisc
}

const pipe2 = [
  {
    $match:{
      peopleId:'205034565'
    },
  },
  {
    $group:{
      _id:null,
      replys:{$push:"$topicId"}
    }
  }
]
