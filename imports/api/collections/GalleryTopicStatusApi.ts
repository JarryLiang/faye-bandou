import {Mongo} from "meteor/mongo";

export const GalleryTopicStatusCollection = new Mongo.Collection("GalleryTopicStatus");

export const GalleryTopicOtherCollection = new Mongo.Collection("GalleryTopicOther");



async function pickOneStatusByOptAndCount(opt,count){

  const sel = {
    ...opt,
    comments_count:{$gt:count}
  }
  const target = await GalleryTopicStatusCollection.findOne(sel);
  return target;

}

async function pickOneStatusByOpt(opt){

  const s1 = await pickOneStatusByOptAndCount(opt,100);
  if(s1){
    return s1;
  }
  const s5 = await pickOneStatusByOptAndCount(opt,5);
  if(s5){
    return s5;
  }
  const s0 = await pickOneStatusByOptAndCount(opt,0);
  if(s0){
    return s0;
  }
  return undefined;
}
async function pickOneStatusToProcess(){
  const after = new Date('2021-06-01').getTime()
  const sel ={
    type:'status',
    comments_count:{$gt:0},
    updated:0,
    timestamp:{$gt:after},
    $or:[{pick:{$exists:false}},{pick:'unhandle'}]
  }
  const target = await pickOneStatusByOpt(sel);

  if(!target){
    return null;
  }
  await GalleryTopicStatusCollection.update({_id:target._id},{$set:{pick:'pick'}});
  return target;

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
export const GalleryTopicStatusApi = {
  findTopicMinMax,
  updateFetchTopicItems,
  pickOneStatusToProcess,
  refreshStatusComments,
  summary
}















