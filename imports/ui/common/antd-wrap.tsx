import message from 'antd/lib/message';

export function showErr(err:any, duration?:number) {
  message.error(JSON.stringify(err, null, 2), duration).then(() => {});
}


export function showMsg(res:any) {
  message.info(JSON.stringify(res, null, 2)).then(() => {});
}
