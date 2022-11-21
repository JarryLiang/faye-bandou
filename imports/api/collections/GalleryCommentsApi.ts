import {GroupApi} from "/imports/api/collections/GroupApi";

import {Mongo} from "meteor/mongo";


//
// TopicLog


export const GalleryCommentsCollection = new Mongo.Collection("GalleryItemComment");


function getTarget(){

  let ll=GalleryCommentsCollection.find({authorId:'205034565'});

  ll =ll.map((r)=>{

    const {_id,topicId,topicName,statusId,statusText,statusAuthorId,statusAuthorName,create_time,authorId,authorName,text} = r;
    const url = `https://www.douban.com/people/${statusAuthorId}/status/${statusId}/`;
    return {
      "日期":create_time,
      "話題":topicName,
      "廣播樓主":statusAuthorName,
      "廣播":statusText,
      "回覆者":authorName,
      "回覆內容":text,
      "廣播url":url,
      '話題id':topicId,
      '回覆id':_id
    }
  });
  return ll;
}

function getTargetRaw(){
  let ll=GalleryCommentsCollection.find({authorId:'205034565'});
  return ll;
}

async function upsertComments(comments: any) {
  let c = 0;
  for(const row of comments){
    const {id} = row;
    const exist = await GalleryCommentsCollection.findOne({_id:id});
    if(exist){
      continue;
    }
    const record = {
      _id:id,
      ...row
    }
    await GalleryCommentsCollection.insert(record);
    c++;
  }

}
async function summary() {
  const all=await GalleryCommentsCollection.find({}).count();
  return {
    all
  }
}

async function showAuthorId(authorId: string) {
  return await GalleryCommentsCollection.find({authorId}).fetch();

}
export const GalleryCommentsApi = {
  getTarget,
  getTargetRaw,
  upsertComments,
  summary,
  showAuthorId
}
