import React from 'react';
import {showErr, showMsg} from "/imports/ui/common/antd-wrap";
import styled from "styled-components";

const Holder = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 100%;
  height: 100%;
  min-height: 40px;
  background-color: #fff;
  &.dash {
     border: dashed 1px #ccc ;
  }
`;



function filterFilesWithFilter(files:any[], filters:string[]) {
  if (filters.length === 0) {
    return files;
  }
  const sz = files.length;
  const remains = [];
  for (let i = 0; i < sz; i++) {
    const file = files[i];
    const { name } = file;
    const lw = name.toLowerCase();
    const match = filters.find((filter) => {
      if (lw.indexOf(filter) >= 0) {
        return true;
      }
      return false;
    });
    if (match) {
      remains.push(file);
    }
  }
  return remains;
}


interface IProps {
  filters:string[];
  dash?:any;
  onOpen:(files:any[])=>void;
}


export function FileDragDrop(props:IProps) {
  const { filters, dash, onOpen } = props;
  const clz = dash ? 'dash' : '';
  function preventDefault(e:Event) {
    e.preventDefault();
  }
  function processFiles(files:any[]) {
    const remains = filterFilesWithFilter(files, filters);
    if (remains.length === 0) {
      showErr('No valid file');
      return;
    }
    if (onOpen) {
      onOpen(remains);
    } else {
      showMsg('open files');
    }
  }
  function handleDrop(event:Event) {
    event.stopPropagation();
    event.preventDefault();
    // @ts-ignore
    const { files } = event.dataTransfer; // FileList object.
    if (files.length === 0) {
      return;
    }

    processFiles(files);
  }
  function handleOpenFile(event:any) {
    event.stopPropagation();
    event.preventDefault();
    // @ts-ignore
    const { files } = event.target;
    processFiles(files);
  }
  // @ts-ignore
  return (<Holder className={clz} onDragOver={preventDefault} onDrop={handleDrop}>
      <input type="file" id="fileinput" onChange={handleOpenFile} />
      <span>Or drag file to here</span>
    </Holder>
  );
}
