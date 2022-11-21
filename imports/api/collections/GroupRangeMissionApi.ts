


import { Mongo } from 'meteor/mongo';



const COL_NAME = "GroupRangeMission";
const GroupRangeMissionCol =  new Mongo.Collection(COL_NAME);



function getByGroupId(groupId){
  return GroupRangeMissionCol.find({groupId}).fetch();
}

function create(groupId, start, end,pass2,type) {
  const record = {
    "groupId" : groupId,
    "start" : start,
    "end" : end,
    "pass2": pass2,
    "type":type,
    "direction" : start>end?-1:1,
    "latest" : -1,
    "status" : "init",
    "createAt" : (new Date()).getTime(),
    "_class" : "com.alibobo.faye.fayedoubanfetch.repo.entry.GroupRangeMission"
  }
  GroupRangeMissionCol.insert(record);
}

function update(newMission){
  const sel = {
    _id:newMission._id
  };
  GroupRangeMissionCol.update(sel,{$set:{...newMission}});
}
function getAll() {
  return GroupRangeMissionCol.find().fetch();
}
function updateAsPhase2(){

  const ll:any[]= GroupRangeMissionCol.find().fetch();

  ll.forEach((r)=>{
    if(r.last===r.start){
      return;
    }
    if(r.last===r.end){
      return;
    }
    GroupRangeMissionCol.update({_id:r._id},{$set:{pass2:true}});
  });
}

export const GroupRangeMissionApi = {
  getByGroupId,
  create,
  update,
  getAll,
  updateAsPhase2
}
