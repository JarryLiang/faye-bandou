import React from "react";
import styled from "styled-components";


interface IProps {
  children: React.ReactNode;
  alignRight?:boolean;
  gap?: number;
  style?:any;
  onClick?:()=>void;
  className?:string;
}

const Holder = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: auto auto auto auto auto auto auto 1fr;
  grid-gap: 10px;
`;

const HolderRight = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 1fr auto;
  grid-gap: 10px;
`;

export function AlignCenterRow(props: IProps) {
  const {
    children, gap, alignRight, style,onClick,className
  } = props;
  const st = gap ? { gridGap: gap, ...style } : { ...style };
  if (alignRight) {
    return (
      <HolderRight style={st} onClick={onClick} className={className}>
        <div />
        {children}
      </HolderRight>
    );
  }
  return (
    <Holder style={st}>
      {children}
    </Holder>
  );
}
