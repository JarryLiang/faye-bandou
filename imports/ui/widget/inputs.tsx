import {StringHelper} from "/imports/helper/string-helpers";
import {SizeType} from "antd/es/config-provider/SizeContext";
import React from "react";
import {Button, Input, InputNumber, Switch, TextArea} from "antd";

const { TextArea } = Input;
interface INumberInputProps {
  value?:number;
  onUpdate:(value:number)=>void;
  defaultValue?:number;
  disabled?:boolean;
}


interface IStringInputProps {
  value?:string;
  onUpdate:(value:string)=>void;
  defaultValue?:string;
  disabled?:boolean;
}



export function NumberInputHook(props:INumberInputProps) {
  const {
    value, onUpdate, defaultValue,
      disabled,  ...rest
  } = props;

  function handleChange(newValue:any) {
    if (newValue === '') {
      if (onUpdate) {
        // @ts-ignore
        onUpdate(defaultValue);
      }
    } else {
      if (onUpdate) {
        onUpdate(newValue);
      }
    }
  }
  return (<InputNumber defaultValue={value} onChange={handleChange} disabled={disabled} {...rest}  />);
}

export function StringInputHook(props:IStringInputProps){
  const {
    value, onUpdate, defaultValue,rows,
    disabled,  ...rest
  } = props;

  // @ts-ignore
  function handleChange(e){
    onUpdate(e.target.value);
  }

  if(rows){
    return(<TextArea value={value} onChange={handleChange} rows={rows} {...rest} />);

  }
  return (
    <Input value={value} onChange={handleChange} {...rest} {...rest}  />
  );

}


interface IButtonWithStateProps {
  title:string;
  onClick:()=>void;
  enable:boolean;
  disableTitle?:string;
  loading?:boolean;
  size?:SizeType;
}



export function ButtonWithState(props:IButtonWithStateProps) {
  const {
    title, onClick, enable, disableTitle, loading, size,
  } = props;

  if (enable) {
    // @ts-ignore
    return (<Button size={size} loading={loading} type="danger" onClick={onClick}>{title}</Button>);
  }
  return (<Button size={size} loading={loading} disabled>{disableTitle || title}</Button>);
}



interface ISwitchInputHookProps {
  checked:boolean;
  onChange:(b:boolean)=>void;
}


export function SwitchInputHook(props:ISwitchInputHookProps) {
  const { checked, onChange } = props;

  function handleChange(c) {
    onChange(c);
  }
  return  (<Switch checked={checked} onChange={handleChange} size="small" />);

}
