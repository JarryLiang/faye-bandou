export function  getCurrentTimeStamp() {
  return new Date().getTime();
}

export function logEnd(start:number){
  const t2 = new Date().getTime();
  console.log(`period: ${t2-start}` );
}

