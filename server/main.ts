import {GalleryCommentsApi} from "/imports/api/collections/GalleryCommentsApi";
import {GalleryTopicApi} from "/imports/api/collections/GalleryTopicApi";
import {GalleryTopicStatusApi} from "/imports/api/collections/GalleryTopicStatusApi";
import {TopicLogApi} from "/imports/api/collections/TopicLogApi";
import {MissionStatus} from "/server/mission_status";
import {MonitorAws} from "/server/monitor-aws";
import {openServer2} from "/server/my-express";
import {Meteor} from 'meteor/meteor';
import {GroupApi} from "/imports/api/collections/GroupApi";
import {GroupMissionApi, ICreateMissionParam} from "/imports/api/collections/GroupMissionApi";
import {GroupRangeMissionApi} from "/imports/api/collections/GroupRangeMissionApi";
import {TopicReplyApi} from "/imports/api/collections/TopicReplyApi";

import {saveStringToFile} from "/imports/helper/IO";

const fs = require('fs');


Meteor.methods({
  'group.getGroups'() {
    return GroupApi.getGroups();
  },
  'group.getGroupsMap'() {
    const ll= GroupApi.getGroups();
    const result = {};
    ll.forEach((l)=>{
      const {id} = l;
      result[id] = l;
    })
    return result;

  },
  'groupmission.create'(data: ICreateMissionParam) {
    GroupMissionApi.createMissions(data);
  },
  'groupmission.fetch'() {
    return GroupMissionApi.getMissions();
  },
  'grouprangemission.getAll'(){
    const ll = GroupRangeMissionApi.getAll();
    return JSON.stringify(ll);
  },
  'grouprangemission.getByGroupId'(groupId){
    return GroupRangeMissionApi.getByGroupId(groupId);
  },
  'grouprangemission.create'(groupId,start,end,pass2,type){
    GroupRangeMissionApi.create(groupId,start,end,pass2,type);
    return true;
  },
  'grouprangemission.update'(data){
    GroupRangeMissionApi.update(data);
    return true;
  },
  'doGroupStatistic': async function(){
    const rr= await  TopicReplyApi.doGroupReplyCount();
    const mm={};
    rr.forEach((r)=>{
      mm[r._id]=r.count;
    })
    return JSON.stringify(mm);
  },
  'doMonthStatisc': async function() {
    const rr= await TopicReplyApi.doMonthStatisc();
    return JSON.stringify(rr);
  },
  'doDailyStatistic':async function(){
    const rr = await TopicLogApi.getDailyStatistis();
    return rr;
  },
  'getGalleryTopics':async function(){
    const ll =await GalleryTopicApi.getUnhandled();
    return JSON.stringify(ll);

  },
  'getAppearTopc':async function(){
    const ll = GalleryCommentsApi.getTargetRaw();
    const topicIds = {};
    ll.forEach((r)=>{
      topicIds[r.topicId]=true;
    });
    return GalleryTopicStatusApi.findTopicMinMax(Object.keys(topicIds));
  },
  'updateGalleryTopic': async function (record){
    await GalleryTopicApi.updateRecord(record);
  },
  'GalleryTopicApi.addTopic':async function (data){
    return GalleryTopicApi.addTopic(data);
  },
  'mission.status':async function(){
    const topic =await GalleryTopicApi.summary();
    const status = await GalleryTopicStatusApi.summary();
    const comments = await GalleryCommentsApi.summary();

    return {
      topic,
      status,
      comments
    }
  },
  'mission.showTarget':async function(authorId){
    const au = authorId ||'205034565';
    const status = await GalleryTopicStatusApi.showAuthorId(au);
    const comments = await GalleryCommentsApi.showAuthorId(au);

    return {
      status_count:status.length,
      comments_count:comments.length,
      status,
      comments
    }
  },
  'mission.statusAgg':async function() {
    const result = await GalleryTopicStatusApi.aggregateByTopic();
    return result;
  },
  'mission.downloadTopics':async function(){
    const topics = await GalleryTopicApi.getAllTopicsToMigrate();
     return {
       status:"OK",
       count:topics.length,
       topics
     }
  },
  'mission.clearBlocked':async function(){
    const r =await GalleryTopicStatusApi.clearBlocked();
    return r;
  },
  'mission.clearPick': async function(){
    await GalleryTopicApi.clearPick();
    await GalleryTopicStatusApi.clearPick();
  },
  'mission.uploadTopics':async function(text){
    const jo=JSON.parse(text);
    const {topics} = jo;
    if(!topics){
      return "Invalid Topic";
    }
    const c =await GalleryTopicApi.addTopics(topics);
    return `Success ${c}`;

  },
  'mission.statusLog':function(){
    return MissionStatus.listStatusLog();
  },
  'mission.commentLog':function(){
    return MissionStatus.listCommentsLog();
  },
  "aws.uploadAddresses":function (addresses){
    MonitorAws.uploadAddress(addresses);
    return "ok";
  },
  "aws.status":async function (){
    const r = await MonitorAws.fetchEC2Status();
    return r;
  },
  "monitor.topicAgg":async function(){
     return await GalleryTopicStatusApi.topicAgg();
  },
  'result.getStatus': async function(authorId){
    return await GalleryTopicStatusApi.getStatusOfAuthor(authorId);
  },
  'result.getComments':async function(authorId){
     return await GalleryCommentsApi.getCommentsOfAuthor(authorId);
  },
  'result.status':async function(statusId){

    const status = await  GalleryTopicStatusApi.getStatusById(statusId);
    const comments = await  GalleryCommentsApi.getCommentsByStatusId(statusId);

    return {
      status,comments
    }

  },
  'result.showAuthor':async function(authorId){
    //const status = await GalleryTopicStatusApi.getStatusOfAuthor(authorId);
    //const comments = await GalleryCommentsApi.getCommentsOfAuthor(authorId);
    const status = await GalleryCommentsApi.showAuthorId(authorId);
    const comments = await GalleryCommentsApi.getCommentsOfAuthor(authorId);

    return {
      status,
      comments
    }
  },
  'doExport'() {
    const ll = [
      '205034565',
    ]
    let result = [];
    ll.forEach((l)=>{
      const list=TopicReplyApi.exportReplyWithTopic(l);
      result =[...result,...list];
    })

    return JSON.stringify(result);
  }

});


function exportToFile(content,fileName){
  var stream = fs.createWriteStream(fileName);
  const result = JSON.stringify(content,null,2);
  stream.once('open', function(fd) {
    stream.write(result);
    stream.end();
  });


}


const newSet = [
  "395401729",
  "381872881",
  "391383671",
  "389842008",
  "381872461",
  "358782593",
  "358820408",
  "372950983",
  "394794972",
  "349687392",
  "367332596",
  "389925559",
  "397889874",
  "395001138",
  "398120551",
  "395503831",
  "389052503",
  "394973641",
  "362871204",
  "379362717",
  "359229474",
  "359230273",
  "381820173",
  "381820124",
  "359635322",
  "388199432",
  "389052524",
  "373063927",
  "358453859",
  "349584061",
  "348335645",
  "357625851",
  "348274665",
  "354032162",
  "387870157",
  "395257449",
  "366693331",
  "349521685",
  "384032000",
  "358232682"
];

async function doExport(){

  const mm = {};
  newSet.forEach((r)=>{
    mm[r]=true;
  });

  let  ll= await GalleryCommentsApi.getCommentsOfAuthor('205034565')

  ll=ll.filter((item)=>{
    if(mm[item._id]){
      return false;
    }
    return true;
  });

  const result=JSON.stringify(ll,null,2);

  const fn =`d:\\comments_[${ll.length}].json`;

  var stream = fs.createWriteStream(fn);
  stream.once('open', function(fd) {
    stream.write(result);
    stream.end();
  });
  console.log("write");


}



Meteor.startup(() => {
  // If the Links collection is empty, add some data.
  // doExport().then(()=>{
  //
  // });
  openServer2();

  //GalleryTopicStatusApi.createTypeIndex();
  // miscCheck().then(()=>{});
  // doCompare();
});
