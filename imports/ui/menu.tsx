import {Button} from "antd";
import React from "react";
import {AlignCenterRow} from "/imports/ui/common/AlignCenterRow";
import {Link} from "react-router-dom";

import {routes} from "/imports/routes";
import styled from "styled-components";

const Holder =styled.div`
  ul {
    display: grid;
    grid-template-columns: repeat(auto-fill, 200px);
    flex-direction: row;
  }
  margin-bottom: 4px;
  border-bottom: solid 1px #AAA;
  padding-bottom: 4px;
`;

export function MenuBar() {
  function renderItems(){
    const lis=routes.map((item)=>{
     const {path,title} = item;
      return(<li key={path}>
        <Link to={path}>{title}</Link>
      </li>);
    });
    return lis;
  }

  return (<Holder>
      <ul>
        {renderItems()}
      </ul>
    <hr/>
  </Holder>);
}
