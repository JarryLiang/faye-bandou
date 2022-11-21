import styled from 'styled-components';


export const CommonPageHolder = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 10px 0px 0px 10px;
  position: relative;

  > .content {
    flex: 1;
    overflow: hidden;
  }

  > .full-cover {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;
