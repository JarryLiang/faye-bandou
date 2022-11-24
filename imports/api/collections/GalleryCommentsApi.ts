import {GalleryTopicStatusApi} from "/imports/api/collections/GalleryTopicStatusApi";
import {GroupApi} from "/imports/api/collections/GroupApi";
import {fetch} from "meteor/fetch";

import {Mongo} from "meteor/mongo";


//
// TopicLog

const _G_AUTHOR ='205034565';

export const GalleryCommentsCollection = new Mongo.Collection("GalleryItemComment");


async function getCommentsOfAuthor(authorId){
  const au = authorId || _G_AUTHOR;

  let ll=await GalleryCommentsCollection.find({authorId:au}).fetch();

  for await (const item of ll){
    const {statusId} = item;
    let statusText = item.statusText;
    if(!statusText){
     const status = await GalleryTopicStatusApi.getStatusById(statusId);

     const  {text} = status;
     console.log(text);
     item.statusText = text;
     await  GalleryCommentsCollection.update({_id:item._id},{$set:{statusText:text}});
    }
  }


  ll.sort((a,b)=>{
    return a.create_time.localeCompare(b.create_time);
  });

  ll =ll.map((r)=>{

    const {_id,topicId,topicName,statusId,statusText,statusAuthorId,statusAuthorName,create_time,authorId,authorName,text} = r;
    const {rootAuthorId,rootAuthorName} = r;

    const url = `https://www.douban.com/people/${rootAuthorId}/status/${statusId}/`;
    let st = statusText || "";
    if(st.length>50){
      st=st.slice(0,50)+"......(略)";
    }
    return {
      "日期":create_time,
      "話題":topicName,
      "廣播樓主":rootAuthorName,
      "廣播":st,
      "回覆者":authorName,
      "回覆內容":text,
      "廣播url":url,
      '話題id':topicId,
      '回覆id':_id,
      "廣播樓主Id":rootAuthorId,
      "回覆者Id":authorId,


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
  return GalleryCommentsCollection.find({authorId}).fetch();

}
async function getCommentsByStatusId(statusId: any) {
  return GalleryCommentsCollection.find({statusId}).fetch();
}

export const GalleryCommentsApi = {
  getCommentsOfAuthor,
  getTargetRaw,
  upsertComments,
  summary,
  showAuthorId,
  getCommentsByStatusId
}
