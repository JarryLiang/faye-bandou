import {GalleryTopicCollection} from "/imports/api/collections/GalleryTopicApi";
import {TopicReplyCollection} from "/imports/api/collections/TopicReplyApi";
import {getCurrentTimeStamp, logEnd} from "/server/helper";
import {Mongo} from "meteor/mongo";

export const GalleryTopicStatusCollection = new Mongo.Collection("GalleryTopicStatus");

export const GalleryTopicOtherCollection = new Mongo.Collection("GalleryTopicOther");



async function createTypeIndex(){
  GalleryTopicStatusCollection.rawCollection().createIndex({type:1});
}

async function pickOneStatusByOptAndCount(opt,count){

  const sel = {
    ...opt,
    comments_count:{$gt:count}
  }
  const target = await GalleryTopicStatusCollection.findOne(sel);
  return target;

}

async function pickOneStatusByOpt(opt){

  const s0 = await pickOneStatusByOptAndCount(opt,0);
  if(s0){
    return s0;
  }
  return undefined;
}


async function pickOneStatusToProcessMin(param,min){
  const {count,unpick} = param;

  const t1 = getCurrentTimeStamp();
  console.log("count:"+count);
  const after = new Date('2021-03-01').getTime()

  const sel ={
    "$and": [
      {
        "updated": 0
      },
      {
        "timestamp": {
          "$gt": after
        }
      },
      {
        "comments_count": {
          "$gt": min
        }
      },
      {
        "$or": [
          {
            "type": "status"
          },
          {
            "type": {$exists:false}
          }
        ]
      },
      {
        "$or": [
          {
            "pick": {
              "$exists": false
            }
          },
          {
            "pick": "unhandle"
          }
        ]
      }
    ]
  }



  const target = await GalleryTopicStatusCollection.find(sel,
    {limit:count}).fetch();
  console.log(JSON.stringify(sel));
  logEnd(t1);

  //

  if(target.length==0){
    return null;
  }

  const ids = target.map((r)=>{return r._id});

  if(!unpick){
    await GalleryTopicStatusCollection.update({_id:{$in:ids}},{$set:{pick:'pick'}},{multi:true});
  }
  //await GalleryTopicStatusCollection.update({_id:target._id},{$set:{pick:'pick'}});

  return target;

}
async function pickOneStatusToProcess(param){
  // let ll = await pickOneStatusToProcessMin(param,10);
  // if(ll && ll.length>0){
  //   return ll;
  // }

  let ll2 = await pickOneStatusToProcessMin(param,2);
  if(ll2 && ll2.length>0){
    return ll2;
  }

  let ll1 = await pickOneStatusToProcessMin(param,1);
  if(ll1 && ll1.length>0){
    return ll1;
  }

  let ll0 = await pickOneStatusToProcessMin(param,0);
  return ll0;
}


async function clearPick() {
  await GalleryTopicStatusCollection.update({pick:"pick"},{$set:{pick:"handled"}},{multi:true});
}


async function aggregateByTopic(){
  const pipeline = [
    {
      $group:{
        _id:"$topicId",
        topicName:{$max:"$topicName"},
        count:{$sum:1},
      }
    },
    {
      $sort:{count:-1}
    }
  ];
  const ll =await GalleryTopicStatusCollection.rawCollection().aggregate(pipeline).toArray();
  return ll;
}

function findTopicMinMax(topicIds){

  const ll=[];
  topicIds.forEach((topicId)=>{
    const rr=GalleryTopicStatusCollection.rawCollection().aggregate([
      {
        $match:{ topicId:topicId}
      },
      {
        $group:{
          _id:null,
          newest:{$max:"$create_time"},
          oldest:{$min:"$create_time"},
          topicName:{$max:"$topicName"},
          topicId:{$max:"$topicId"}
        }
      }
    ]).toArray();
    ll.push(rr[0]);
  });
  return ll;

}


//note , topic

async function updateGalleryTopicItem(parent,item){

  const {
    id,
    authorId,
    authorName,
    type,
    create_time,
    timestamp,
    title,
    abstract,
    text,
    photo_count,
    cover_url,
    sharing_url,
    url,
    comments_count,
    group, //if topic
  } = item;


  const toSave = {
    _id:id,
    id,
    ...parent,
    authorId,
    authorName,
    type:type||"status",
    create_time,
    timestamp,
    title,
    abstract,
    text,
    photo_count,
    cover_url,
    sharing_url,
    url,
    comments_count,
    group, //if topic
    fetched_comments_count:0,
    comments_updated:-1,
    updated:0,
  }

  //search
  const oldStatus=await GalleryTopicStatusCollection.findOne({_id:id})
  if(oldStatus){
    //just update comment count
    if(oldStatus.comments_count != comments_count){
      const toUpdate ={
        comments_count,
        updated:(new Date()).getTime()
      }
      await GalleryTopicStatusCollection.update({_id:id},{$set:toUpdate});
    }
    return;
  }
  await  GalleryTopicStatusCollection.insert(toSave);
}

async function updateFetchTopicItems(data:any){
  const {id:topicId,topicName,status,others} = data;

  const parent = {
    topicId,
    topicName
  }

  if(status && status.length>0){
    for(const item of status){
      await updateGalleryTopicItem(parent,item);
    }
  }

  if(others && others.length>0){
    for(const item of others){
      await updateGalleryTopicItem(parent,item);
    }
  }



}

async function refreshStatusComments(data: any) {
  const {statusId,limited,comments,msg,updated} = data;

  let fetched_comments_count =0;
  let comments_updated =0 ;
  if(comments){
    fetched_comments_count = comments.length;
    comments_updated= new Date().getTime();
  }
  const toUpdate = {
    pick:'handled',
    limited,
    msg,
    updated,
    fetched_comments_count,
    comments_updated,
  };
  await GalleryTopicStatusCollection.update({_id:statusId},{$set:toUpdate});
}
async function summary() {

  const total= await GalleryTopicStatusCollection.find({}).count();
  const withComment= await GalleryTopicStatusCollection.find({ comments_count:{$gt:0}}).count();
  const updated= await GalleryTopicStatusCollection.find({ comments_count:{$gt:0},updated:{$gt:0}}).count();

  return {
    total,
    withComment,
    updated
  }

}
async function showAuthorId(authorId:string) {
  // @ts-ignore
  const ll =await GalleryTopicStatusCollection.find({authorId}).fetch();
  return ll;
}

async function topicAgg() {
  const pipeline =  [
    {
      $group:{
        _id:"$topicId",
        topicName:{ $max: "$topicName"},
        count:{$sum:1}
      }
    },
    {
      $sort:{
        count:-1
      }
    }
  ];

  const ll =await GalleryTopicStatusCollection.rawCollection().aggregate(pipeline).toArray();

  return {
    count:ll.length,
    topics:ll
  };
}
const _G_AUTHOR ='205034565';

async function getStatusOfAuthor(authorId: string) {
  const au = authorId || _G_AUTHOR;
  const ll =await GalleryTopicStatusCollection.find({authorId:au}).fetch();
  return ll;
}

async function getStatusById(statusId: any) {
  return await GalleryTopicStatusCollection.findOne({_id:statusId});
}

async function clearBlocked(){
  const sel ={
    updated:{$gt:0},
    comments_count:{$gt:1},
    fetched_comments_count:0,
    pick:'handled'
  };
  const mod ={
    $set:{
      updated:0,
      pick:'unhandle'
    }
  };

  const c = await GalleryTopicStatusCollection.update(
    sel,mod,{multi:true});

  return c;

}
export const GalleryTopicStatusApi = {
  findTopicMinMax,
  updateFetchTopicItems,
  pickOneStatusToProcess,
  refreshStatusComments,
  summary,
  aggregateByTopic,
  showAuthorId,
  clearPick,
  createTypeIndex,
  topicAgg,
  getStatusOfAuthor,
  getStatusById,
  clearBlocked
}















