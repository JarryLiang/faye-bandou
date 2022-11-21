import Icon from "antd/lib/icon";
import React from "react";
import {Popconfirm} from "antd";

import styled from "styled-components";


const Holder = styled.div`
  display: grid;
  grid-template-columns: 1fr 30px;
  margin: 4px;
  &.no-margin {
    margin: 0px;
  }
  border-radius: 8px;
  border: solid 1px #ccc;
  padding: 8px 4px 8px 8px;

  > .right-part {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-left: solid 1px #ccc;
    > i {
      margin: 4px;
      padding: 4px;
      border: solid 1px #CCC;
      &:hover {
         background-color: #AAF;
      }
    }
  }
`;

interface IProps {
  children:any;
  onDel:()=>void;
  onEdit?:()=>void;
  onCopy?:()=>void;
  noMargin?:()=>void;

}


export function RemovableItem(props:IProps) {
  const { children, onDel, onEdit, onCopy, noMargin } = props;
  const clz = noMargin ? 'no-margin' : '';
  return (
    <Holder className={clz}>
      {children}
      <div className="right-part">
        {onDel && (
          <Popconfirm
            title="Are you sure？"
            okText="Yes"
            cancelText="No"
            onConfirm={() => {
              onDel();
            }}
          >
            <Icon type="close" />
          </Popconfirm>

        )}
        {onEdit && (<Icon type="edit" onClick={onEdit} />)}
        {onCopy && (<Icon type="copy" onClick={onCopy} />)}
      </div>
    </Holder>
  );
}
