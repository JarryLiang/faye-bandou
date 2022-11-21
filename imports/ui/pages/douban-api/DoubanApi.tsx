import {AlignCenterRow} from "/imports/ui/common/AlignCenterRow";
import React, {useState} from "react";
import {CommonPageHolder} from "/imports/ui/common/container";
import styled from "styled-components";

import {Button} from "antd";

const Holder = styled(CommonPageHolder)`
  > .content {
    background-color: #00acff;

  }
`;

export function DoubanApi(){

  const [discuss,setDiscuss ] = useState(null);
  function doGetDiscussion(){

    //652201
    //v2/target/:id/discussions

    //GET https://api.douban.com/v2/discussion/:id


    const id = '652201'
    const url =`https://api.douban.com/v2/douban_common_basic/${id}/discussions?apikey=0df993c66c0c636e29ecbb5344252a4a`;

    console.log(url);

    fetch(url)
      .then((response) => response.json())
      .then((data) =>{
        debugger
          console.log(data);
      }).catch((e)=>{
        debugger
        console.log(e);
    });


  }

  function doGetComment(){

  }
  return(<Holder>
    <AlignCenterRow>
      <Button onClick={doGetDiscussion}>Get Discussion</Button>
      <Button onClick={doGetComment}>Get Comment</Button>
    </AlignCenterRow>
    <pre>
      {JSON.stringify(discuss,null,2)}
    </pre>
  </Holder>);

}
