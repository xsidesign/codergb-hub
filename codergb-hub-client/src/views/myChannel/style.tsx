import styled from "styled-components";
export const MyChannelWrapper = styled.div`
  .banner{
    width: 100%;
    img{
      width: 100%;
    }
  }
  .user-info{
    display: flex;
    align-items: flex-start;
    margin: ${30/40}rem 0 0 0;
    .img-container{
      width: ${120/40}rem;
      img{
        width: 100%;
        border-radius: 50%;
      }
    }
    .right-info{
      margin: 0 0 0 ${24/40}rem;
      .user-name{
        font-size: ${28/40}rem;
      }
    }
  }
`