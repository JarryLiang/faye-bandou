
let _StatusLogs:string[] = [];
let _CommentsLogs:string[] = [];

function listStatusLog(){
  const r = [..._StatusLogs];
  r.reverse();
  return r;
}

function listCommentsLog(){
  const r = [..._CommentsLogs];
  r.reverse();
  return r;
}

function appendStatusLog(info:string){
  _StatusLogs.push(info);
  // @ts-ignore
  _StatusLogs=_StatusLogs.slice(-20);
}

function appendCommentsLog(info:string){
  _CommentsLogs.push(info);
  // @ts-ignore
  _CommentsLogs=_CommentsLogs.slice(-100);
}


function logSubmitTopic(req,data: any) {
  const from =req.socket.remoteAddress;
  const {id,topicName,total,count,msg,updatedAt} = data;

  const ds=new Date(updatedAt).toISOString();

  if(msg){
    const info=`${ds} / ${from}  => ${id}[${topicName}] ${msg}`;
    appendStatusLog(info);
  }else {
    const info=`${ds} / ${from}  => ${id}[${topicName}] submit ${count}/${total} `;
    appendStatusLog(info);
  }

}

function logSubmitComments(req,data: any) {
  const from =req.socket.remoteAddress;

  const {
    ip,
    statusId,
    limited,
    comments,
    updated,
    msg,
  } = data;

  const ds=new Date(updated).toISOString();

  let log = null;
  if(comments){
    log=`${ds}/${from} [${ip}] Status: ${statusId} comments:${comments.length} limitd:${limited}`;
  }else {
    log=`${ds}/${from} [${ip}] Status: ${statusId} ${msg} `;
  }
  appendCommentsLog(log);
  console.log(log);

}

export const MissionStatus = {
  logSubmitTopic,
  logSubmitComments,
  listStatusLog,
  listCommentsLog,
}
