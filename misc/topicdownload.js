
function download(url, fileName) {
  const fn = fileName || 'file';
  const a = document.createElement('a');
  document.body.appendChild(a);
  a.target = '_blank';
  a.style = 'display: none';
  a.href = url;
  a.download = fn;
  a.click();
}
function saveStringToFile(srcContent, fileName) {
  if (!srcContent) {
    return;
  }
  let content = srcContent;

  if (typeof (content) !== 'string') {
    content = JSON.stringify(srcContent, null, 2);
  }

  const a = document.createElement('a');
  document.body.appendChild(a);
  a.style = 'display: none';

  const blob = new Blob([content], { type: 'application/json' });
  const url = window.URL.createObjectURL(blob);

  a.href = url;
  a.download = fileName;
  a.click();
  window.URL.revokeObjectURL(url);
}




let clicki=0;
function tryClick(){
  const c=document.querySelector(".load-more-btn");
  if(c){
    clicki++;
    console.log("click:"+clicki);
    c.click();
    return true;
  }
  return false;
}


function downloadTopics(){
  const ll=document.querySelectorAll(".topic-link");
  let sz=ll.length;
  const result =[];
  for(let i=0;i<sz;i++){
    const li = ll[i];
    const aTag=li.querySelector("a");
    const rr = {};
    if(aTag){
      const href=aTag.getAttribute("href");
      const title=aTag.innerText;
      const topicId = href.split("topic/")[1].split("/")[0];
      rr.title= title;
      rr.topicId = topicId;
    }
    const countTag = li.querySelector(".count");
    let docs = 0;
    let join = 0;
    let follow =0;
    if(countTag){
      const cText=countTag.innerText;
      {
        const mm=cText.match(/(\d+)篇文章/)
        if(mm){
          if(mm.length>1){
            try{
              docs=parseInt(mm[1]);
            }catch (e){

            }
          }
        }
      }
      {
        const mm=cText.match(/(\d+)参与/)
        if(mm){
          if(mm.length>1){
            try{
              join=parseInt(mm[1]);
            }catch (e){

            }

          }
        }
      }
      {
        const mm=cText.match(/(\d+)关注/)
        if(mm){
          if(mm.length>1){
            try{
              follow=parseInt(mm[1]);
            }catch (e){

            }

          }
        }
      }
    }
    rr.docs = docs;
    rr.join = join;
    rr.follow = follow;
    if(rr.topicId){
      result.push(rr);
    }
  }
  return result;
}

let handle = setInterval(()=>{
  const b =tryClick();
  if(!b){
    clearInterval(handle)
    const ll=downloadTopics();
    const fn= window.location.href.split("?")[1]+"_topics.json";
    saveStringToFile(ll,fn);
  }
},3000);

