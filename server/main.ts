import {GalleryCommentsApi} from "/imports/api/collections/GalleryCommentsApi";
import {GalleryTopicApi} from "/imports/api/collections/GalleryTopicApi";
import {GalleryTopicStatusApi} from "/imports/api/collections/GalleryTopicStatusApi";
import {TopicLogApi} from "/imports/api/collections/TopicLogApi";
import {openServer2} from "/server/my-express";
import {Meteor} from 'meteor/meteor';
import {GroupApi} from "/imports/api/collections/GroupApi";
import {GroupMissionApi, ICreateMissionParam} from "/imports/api/collections/GroupMissionApi";
import {GroupRangeMissionApi} from "/imports/api/collections/GroupRangeMissionApi";
import {TopicReplyApi} from "/imports/api/collections/TopicReplyApi";


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
  'updateGalleryTopic': function (record){
    GalleryTopicApi.updateRecord(record);

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
  'mission.showTarget':async function(){
    const status = await GalleryTopicStatusApi.showAuthorId('205034565');
    const comments = await GalleryCommentsApi.showAuthorId('205034565');

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
       topics
     }
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


function doExport(){

  const ll=GalleryCommentsApi.getTarget()
  const result=JSON.stringify(ll,null,2);

  var stream = fs.createWriteStream("d:\\comments.json");
  stream.once('open', function(fd) {
    stream.write(result);
    stream.end();
  });
  console.log("write");


}
Meteor.startup(() => {
  // If the Links collection is empty, add some data.
  //doExport();
  openServer2();

});
