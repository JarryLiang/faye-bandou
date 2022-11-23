import {GalleryTopicApi} from "/imports/api/collections/GalleryTopicApi";
import {GalleryTopicStatusApi} from "/imports/api/collections/GalleryTopicStatusApi";

var AsyncLock = require('async-lock');
var lock = new AsyncLock();



interface Callback {
  (err:any,ret:any):void;
}


function getGalleryTopicWorks(callback:Callback){
  lock.acquire('gallerytopic',function (done:Callback){
    GalleryTopicApi.pickOneTopicToProcess().then((r)=>{
      done(null,r);
    }).catch((err)=>{
      done(err,null);
    });
    //done(err,ret);
  },function (err:any,ret:any){
    callback(err,ret);
  });

}

function getStatusWorks(param,callback:Callback){
  lock.acquire('galleryStatus',function (done:Callback){
    GalleryTopicStatusApi.pickOneStatusToProcess(param).then((r)=>{
      done(null,r);
    }).catch((err)=>{
      done(err,null);
    });
    //done(err,ret);
  },function (err:any,ret:any){
    callback(err,ret);
  });

}
export const LockCenter = {
  getGalleryTopicWorks,
  getStatusWorks
}
