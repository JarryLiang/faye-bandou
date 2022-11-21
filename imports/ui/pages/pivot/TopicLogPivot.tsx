import {MenuBar} from "/imports/ui/menu";
import React,{useState,useEffect} from 'react';
import styled from 'styled-components';
import { Meteor } from "meteor/meteor";
import { CommonPageHolder } from "../../common/container";
import PivotTableUI from 'react-pivottable/PivotTableUI';
import 'react-pivottable/pivottable.css';


const Holder = styled(CommonPageHolder)`
  > .content {
    overflow-y: auto;

  }
`;
interface IProps {

}

const headers = [
  'groupName',
  'month',
  'day',
];


function TopicLogPivot(props:IProps) {
  const { } = props;
  const [rawData,setRawData ] = useState();
  const [dataset,setDataset ] = useState(null);
  const [pivotState, setPivotState] = useState(null);

  useEffect(() => {

  }, []);

  function prepareState(){
    const newState = {
      rows: [
        'groupName',
      ],
      cols: [
        'month',
      ],
      valueFilter: {
        State: {
          Accepted: true,
          NotAcceptedDone: true,
        },
      },
      aggregatorName: 'Sum',
      rendererName: 'Table Heatmap',
      vals: ['count'],
    };
    setPivotState(newState);
  }
  useEffect(()=>{
    Meteor.call("doDailyStatistic",(err,res)=>{
      setRawData(res);
      setDataset(res);
      prepareState();
    });
  },[]);

  return (
    <Holder>
      <MenuBar/>
      TopicLogPivot
      <div className={"content"}>
        {dataset && (
          <PivotTableUI
            data={dataset}
            onChange={(s) => {
              setPivotState(s);
            }}
            {...pivotState}
          />
        )}
      </div>
    </Holder>
  );
}


export default TopicLogPivot;
