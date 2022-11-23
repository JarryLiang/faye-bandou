import {GalleryCommentsApi, GalleryCommentsCollection} from "/imports/api/collections/GalleryCommentsApi";
import {GalleryTopicApi} from "/imports/api/collections/GalleryTopicApi";
import {GalleryTopicStatusApi} from "/imports/api/collections/GalleryTopicStatusApi";
import {getCurrentTimeStamp, logEnd} from "/server/helper";
import {LockCenter} from "/server/lock-center";

const fs = require('fs');
const express = require('express')
const app = express()
//app.use(express.limit(10000000));
app.use(express.json({limit:'50mb'}));
app.use(express.urlencoded({limit: '50mb'}));
const _ANOTHER_PORT = 4000; //use 4000 to ..

import {MissionStatus} from "/server/mission_status";

// @ts-ignore
function saveContentToFile(content,fileName){
  var stream = fs.createWriteStream(fileName);
  const result = JSON.stringify(content,null,2);
  stream.once('open', function(fd) {
    stream.write(result);
    stream.end();
  });

}

// @ts-ignore
app.post("/submitGalleryTopicWorks",async (req,res)=>{
  const data = req.body;

  await GalleryTopicApi.refreshTopicUpdate(data);
  await GalleryTopicStatusApi.updateFetchTopicItems(data);

  MissionStatus.logSubmitTopic(req,data);
  //saveContentToFile(data,`d:\\temp\\_${topicId}.json`);
  //refresh..
  //save -->
  const result ={
    status:"success"
  }

  res.send(JSON.stringify(result));

});

// @ts-ignore
app.post('/galleryTopicWorks', (req, res) => {

  const t1 = getCurrentTimeStamp();
  LockCenter.getGalleryTopicWorks((err,result)=>{
    if(err){
      const data = {
        error:err,
      };
      const str =JSON.stringify(data,null,2);
      res.send(str);
    }else {
      const data = {
        topic:result
      }

      const str=JSON.stringify(data,null,2);

      res.send(str);
      logEnd(t1);
    }
  });

});


/*
* get a status to update.
* */
app.post("/submitStatusComments",async (req:any,res:any)=>{
  const data = req.body;


  const {statusId} = data;

  // const fn= `d:\\temp\\status_${statusId}.json`;
  // saveContentToFile(data,fn);

  await GalleryTopicStatusApi.refreshStatusComments(data);
  if(data.comments){
    await GalleryCommentsApi.upsertComments(data.comments);
  }
  MissionStatus.logSubmitComments(req,data);
  const result ={
    status:"success"
  }
  res.send(JSON.stringify(result));
});


app.post("/galleryStatusWorks",(req,res)=>{
  const {count} = req.query;
  console.log(`count: ${count}`);
  let cc =parseInt(count);
  if(isNaN(cc)){
    cc=1;
  }

  LockCenter.getStatusWorks({count:cc},(err,result)=>{
    if(err){
      const data = {
        error:err,
        status:null,
      };
      const str =JSON.stringify(data,null,2);
      res.send(str);
    }else {
      const data = {
        statusList:result
      }
      const str=JSON.stringify(data,null,2);

      res.send(str);
    }
  });

})



export function openServer2(){
  app.listen(_ANOTHER_PORT, () => {
    console.log(`Example app listening on port ${_ANOTHER_PORT}`)
  })
}
