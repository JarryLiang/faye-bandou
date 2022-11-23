import {Mongo} from "meteor/mongo";



export const GalleryTopicCollection = new Mongo.Collection("GalleryTopic");

//db.getCollection('GalleryTopic').update({pick:'pick'},{$set:{pick:'unhandle'}},{multi:true})



async function getOneUnhandledPriori(n){
  const baseOpt = {
                    $and:[
                      {updatedAt:0},
                      {$or:[{exclude:false},{exclude:{$exists:false}}]},
                      {$or:[{pick:{$exists:false}},{pick:'unhandle'}]},
                      {priori:{$gt:n}}
                    ]
                  };
  const r=await GalleryTopicCollection.findOne(baseOpt);
  return r;
}

async function getOneUnhandled(){

  const r2 = await getOneUnhandledPriori(2)
  if(r2){
    return r2;
  }

  const r1 = await getOneUnhandledPriori(1)
  if(r1){
    return r1;
  }


  const r0 = await getOneUnhandledPriori(0)
  if(r0){
    return r0;
  }

  const r_1 = await getOneUnhandledPriori(-1)
  if( r_1){
    return  r_1;
  }
  return  null;

}

async function clearPick() {
  await GalleryTopicCollection.update({pick:"pick"},{$set:{pick:"handled"}},{multi:true});
}
async function markAsPick(_id:string){
  await GalleryTopicCollection.update({_id},{$set:{pick:"pick"}});
}
async function markAsHandled(_id:string){
  await GalleryTopicCollection.update({_id:_id},{$set:{pick:"handled"}});
}

async function pickOneTopicToProcess(){
  const r= await getOneUnhandled();
  if(r){
    // @ts-ignore
    await markAsPick(r._id);
    return r;
  }
  return null;
}

async function getUnhandled(){
  const ll:any[]=GalleryTopicCollection.find({updatedAt:0}).fetch();

  return ll;


}
async function updateRecord(record: any) {
  const {priori,exclude} = record;
  await GalleryTopicCollection.update({_id:record._id},{$set:{priori,exclude}});
}

async function addTopics(topics:any){

  let c = 0;
  for(const item of topics){
    const i=await addTopic(item);
    c+=i;
  }
  return c;

}
async function addTopic(data: any) {
  const {_id} = data;
  const r= await GalleryTopicCollection.findOne({_id});
  if(r){
    return 0;
  }

  await GalleryTopicCollection.insert({
    ...data,
    "updatedAt" : 0,
    "minTime" :  0,
    "timestamp" : 0,
    "exclude" : data.exclude || false,
  });
  return 1;

}

async function refreshTopicUpdate(data: any) {
  const {id,timeStr,minTime,total,updatedAt,msg} = data;

  const toUpdate = {
    timeStr,minTime,total,updatedAt,msg,
    pick:"handled"
  }
  await GalleryTopicCollection.update({_id:id},{$set:toUpdate});
}

async function summary() {

  const all = await GalleryTopicCollection.find({}).count();
  const pick =await GalleryTopicCollection.find({pick:'pick'}).count();
  const unhandle =await GalleryTopicCollection.find({$or:[{pick:{$exists:false}},{pick:'unhandle'}}).count();
  const handled =await GalleryTopicCollection.find({pick:'handled'}).count();

  return {
    all,
    pick,
    unhandle,
    handled
  }
}

async function getAllTopicsToMigrate() {
  const cursor = GalleryTopicCollection.find({});

  const before = new Date('2022-11-14').getTime();
  const result = [];
  for await (const doc of cursor){
    const {
      _id,
      total,
      name,
      exclude,
      updatedAt,
      priori
    } = doc;
    if(!exclude){
        result.push({
          _id,
          total,
          name,
          exclude,
          updatedAt:0,
          priori
        });
    }
  }
  return result;
}
export const GalleryTopicApi = {
  getUnhandled,
  updateRecord,
  addTopic,
  addTopics,
  getOneUnhandled,
  markAsPick,
  markAsHandled,
  pickOneTopicToProcess,
  refreshTopicUpdate,
  summary,
  getAllTopicsToMigrate,
  clearPick
}
