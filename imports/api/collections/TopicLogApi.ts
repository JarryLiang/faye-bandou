import {GroupApi} from "/imports/api/collections/GroupApi";
import {TopicReplyCollection} from "/imports/api/collections/TopicReplyApi";
import {Mongo} from "meteor/mongo";


//
// TopicLog

export const TopicLogCollection = new Mongo.Collection("TopicLog");



async function getDailyByGroupId(filter,groupId,groupName){

  const pipeline = [
    {
      $match:filter
    },
    {
      "$project":{
        "tempDate":{
          $toDate:"$timestamp"
        }
      }
    },
    {
      "$project":{
        "day":{
          $dateToString:{ format:"%Y-%m-%d",date:"$tempDate" }
        },
        "month":{
          $dateToString:{ format:"%Y-%m",date:"$tempDate" }
        }
      }
    },
    {
      $group:{
        "_id":"$day",
        day:{$max:"$day"},
        count:{$sum:1},
        month:{$max:"$month"},
      }
    },
    {
      $sort:{
        "_id":-1

    }
  ];

  let ll=await TopicLogCollection.rawCollection().aggregate(pipeline).toArray();

  ll=ll.map((r)=>{
    return {
      ...r,
      groupId,
      groupName
    };
  });
  return ll;
}
async function getDailyStatistis(){
  const m =GroupApi.getGroupMap();
  const ps=Object.keys(m).map((groupId)=>{
    const r= m[groupId];
    return getDailyByGroupId({groupId:groupId},groupId,r.name);
  });

  const results =await Promise.all(ps);
  const allRecords=[];
  results.forEach((result)=>{
    result.forEach((r)=>{
      allRecords.push(r);
    })
  });
  return allRecords;
}

function getByTopicId(topicId:string){
  return TopicLogCollection.findOne({topicId});
}

async function getReplyCount(){
  const pipeline = [
    {
      $match:{
        replyFetched:true,
      }
    },
    {
      $group:{
        "_id":null,
        count:{$sum:"$replyCount"}
      }
    }
  ]

  let ll=await TopicLogCollection.rawCollection().aggregate(pipeline).toArray();

  return ll.count;


}
export const TopicLogApi = {
  getByTopicId,
  getDailyStatistis,
  getReplyCount
}
