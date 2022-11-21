
import {StringHelper} from "/imports/helper/string-helpers";
import { Mongo } from 'meteor/mongo';

export const GroupLinkCollection = new Mongo.Collection("GroupLink");



const text=`
夫妻吵架群众评理居委会|\t176706
亲密关系修复互助会|\t724924
意难平小组|\t652201
人间情侣观察|\tcpobserve
独居者联盟|\t673387
人生清单|\t648309
跨年龄段烦恼交流会|\t724338
书籍消化行动|\t679784
买书 读书 一起来吧|\t617525
买书如山倒 读书如抽丝|\tbuybook
最近我们读了同一本书|\treadingmania
分享是阅读的动力|\t649980
来广东你一定要尝尝这个|\t732000
来看看我的浴室吧|\t721558
一起来整理丫|\tclear
下单前冷却小组|\t727756
吸猫头鹰协会|\t679010
旅游失败小组|\t699153
螺蛳粉fans|\t636925
冰淇淋好吃研究所|\t669800
今天喝咖啡了吗|\tdailycoffee
我们都爱咖啡和面包|\t720573
菜市场爱好者|\t702167
A gift for you / 礼物中心|\tgift_for_you
泡面，冲鸭|\t688833
就知道吃|\tjusteat
豆瓣酒鬼种草拔草基地|\t699119
我们每天都要打扫卫生|\t663045
下厨房|\t596337
便利店美食|\t667320
好看的餐具拯救世界|\thaokancanju\t
生活組\t586674
`

function upsertGroup(name:string,id:string){
  GroupLinkCollection.upsert({id},{$set:{name,id}},{multi:false});
}


function initGroup(){
  text.split("\n").forEach((line)=>{
    if(StringHelper.isBlank(line)){
      return;
    }
    const ss:string[]=line.split("|");
    if(ss.length!==2){
      return;
    }
    let s1 = ss[0].trim();
    let s2 = ss[1].trim();
    if(StringHelper.isBlank(s1)){
      return;
    }
    if(StringHelper.isBlank(s2)){
      return;
    }
    upsertGroup(s1,s2);
  });
}

function getGroups() {
  return GroupLinkCollection.find({}).fetch();
}

function getGroupMap(){
  const ll = getGroups();
  const result = {};
  ll.forEach((g)=>{
    const {id} = g;
    result[id] = g;
  })
  return result;
}
export const GroupApi = {
  upsertGroup,
  initGroup,
  getGroups,
  getGroupMap
}




