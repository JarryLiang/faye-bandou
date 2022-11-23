import axios from "axios";
interface TConfig {
  addresses:string[]
}
const config:TConfig = {
  addresses:[]
}

let lastResult:any[] = [];
function uploadAddress(addresses:string[]){
  config.addresses = [...addresses];
}

/***********************************************
 *
 *
 *
 **********************************************/
async function doFetchStatus(address:string){
  try{
    const url=`http://${address}:3000/metrics`;
    const response = await axios.get(url);
    return {
      address,
      data:response.data
    }
  }catch (e){
    return {
      address,
      error:JSON.stringify(e)
    }
  }

}

async function fetchEC2Status(){
  const ps =config.addresses.map((address)=>{
    return doFetchStatus(address);
  });

  const values= await Promise.all(ps);
  lastResult = values;
  return lastResult;

}

export const MonitorAws = {
  uploadAddress,
  fetchEC2Status
}
