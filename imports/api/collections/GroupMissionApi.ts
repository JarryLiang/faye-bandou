import {GroupApi} from "/imports/api/collections/GroupApi";
import {Mongo} from "meteor/mongo";


export const GroupMissionCollection = new Mongo.Collection("GroupMission");

export interface ICreateMissionParam {
  groupId:string;
  type:string;
  start:number;
  end:number;
  force?:boolean;
}


function createMissions(data: ICreateMissionParam) {
  const {
    groupId,
    type,
    start,
    end,
  } = data;

  for(let pid =start;pid<=end;pid++) {
    const sel = {
      groupId,
      type,
      pid
    }
    const ll:any[] = GroupMissionCollection.find(sel).fetch();
    if(ll.length>0){
      continue;
    }
    //--insert
    const record = {
      groupId,
      type,
      pid,
      timestamp:Date.now(),
      status:'init'
    }
    GroupMissionCollection.insert(record);
  }


}

function getMissions() {
  const groups =GroupApi.getGroups();
  const result = {

  }
  groups.forEach((g)=>{
    const sel = {groupId:g.id}
    const ll = GroupMissionCollection.find(sel).fetch();
    const groupItem = {
      groupId: g.id,
      'new':[],
      'essence':[]
    }
    ll.forEach((r)=>{
      groupItem[r.type].push(r);
    });
    result[g.id] = groupItem;
  });
  return result;
}

export const GroupMissionApi = {
  createMissions,
  getMissions
}
