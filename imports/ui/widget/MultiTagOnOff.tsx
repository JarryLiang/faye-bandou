import {AlignCenterRow} from "/imports/ui/common/AlignCenterRow";
import {Tag} from "antd";
import React from 'react';


import {excludeFromList,existInList} from "/imports/helper/collections";





interface IProps {
  items:any;
  value?:any;
  values?:any;
  onUpdate:any;
  single:any;
  toggleAll?:any;
  Component?:any;
  selectedColor?:any;
  unselectedColor?:any;
}


// TODO: add toggle all
export function MultiTagOnOff(props:IProps) {
  const {
    items, value, values, onUpdate, single, toggleAll, Component, selectedColor, unselectedColor,
  } = props;
  // @ts-ignore
  function removeItem(k) {
    if (single) {
      onUpdate(null);
    } else {
      const newValues = excludeFromList(values, [k]);
      onUpdate(newValues);
    }
  }
  // @ts-ignore
  function addItem(k) {
    if (single) {
      onUpdate(k);
    } else if (!existInList(values, k)) {
      onUpdate([...values, k]);
    }
  }
  // @ts-ignore
  function renderItem(item, selected) {
    if (typeof (item) === 'string') {
      if (selected) {
        if (Component) {
          return (<Component value={item} key={item} color={selectedColor || '#00f'} onClick={() => { removeItem(item); }} />);
        }
        return (<Tag key={item} color={selectedColor || '#00f'} onClick={() => { removeItem(item); }}>{item}</Tag>);
      }
      if (Component) {
        return (<Component color={unselectedColor} value={item} key={item} onClick={() => { addItem(item); }} />);
      }
      return (<Tag color={unselectedColor} key={item} onClick={() => { addItem(item); }}>{item}</Tag>);
    }
    const { label, value: v } = item;

    if (selected) {
      return (<Tag key={v} color={selectedColor || '#00f'} onClick={() => { removeItem(v); }}>{label}</Tag>);
    }
    return (<Tag key={v} color={unselectedColor} onClick={() => { addItem(v); }}>{label}</Tag>);
  }
  function handleAllOn() {
    // @ts-ignore
    const list = items.map((item) => {
      if (typeof (item) === 'string') {
        return item;
      }
      return item.value;
    });
    onUpdate([...list]);
  }
  function handleAllOff() {
    if (single) {
      onUpdate(null);
    } else {
      onUpdate([]);
    }
  }

  // @ts-ignore
  function checkEqual(item, select) {
    if (!select) {
      return false;
    }
    if (typeof (item) === 'string') {
      return item === select;
    }
    return item.value === select;
  }

  function renderIems() {

    // @ts-ignore
    const views = items.map((item) => {
      if (single) {
        return renderItem(item, checkEqual(item, value));
      }
      // @ts-ignore
      const exist = values.find((v) => {
        return checkEqual(item, v);
      });
      return renderItem(item, exist);
    });
    if (views.length > 0) {
      if (toggleAll) {
        if (!single) {
          views.push(<Tag key="allOn" onClick={handleAllOn}>All</Tag>);
        }
        views.push(<Tag key="allOff" onClick={handleAllOff}>Clear</Tag>);
      }
    }

    return views;
  }
  if (items.length === 0) {
    return null;
  }


  return (
      <AlignCenterRow>
        {renderIems()}
      </AlignCenterRow>
  );
}
