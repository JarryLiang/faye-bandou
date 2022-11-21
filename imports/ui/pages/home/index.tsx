
import {MenuBar} from "/imports/ui/menu";
import React,{useState,useEffect} from 'react';
import styled from 'styled-components';


const Holder = styled.div`

`;

interface IProps {

}

function Home(props:IProps) {
  const { } = props;
  return (
    <Holder>
      <MenuBar/>
      Home
    </Holder>
  );
}


export default Home;
