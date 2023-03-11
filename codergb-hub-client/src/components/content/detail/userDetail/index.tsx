import React, {memo, FC, ReactElement, useEffect, useState} from 'react';
import { Tabs } from 'antd';
import {useLocation,useNavigate} from 'react-router-dom';
import {
  UserDetailWrapper
} from "./style"
import {IChannel} from "../../../../types/channel/IChannel";
import {getUserChannel} from "../../../../network/channel";
import {IResponseType} from "../../../../types/responseType";
import {channel} from "diagnostics_channel";
import {tabs} from "./config";
import {getUserBlock} from "../../../../network/block";
import {IBlock} from "../../../../types/block/IBlock";
import {UPLOADED_VIDEO} from "../../../../constant/block";
import UploadedVideo from "./childCpn/uploadedVideo";
const UserDetail:FC=():ReactElement=>{
  const location = useLocation();
  const navigate = useNavigate();
  const {userId} = location.state;

  const [keyIndex,setKeyIndex] = useState<number>(0);
  const [userChannel,setUserChannel] = useState<IChannel>();
  const [block,setBlock] = useState<IBlock[]>([]);
  const [userTabs,setUserTabs]=useState<any[]>([]);
  useEffect(()=>{
    getUserChannel<IResponseType<IChannel>>(userId).then((data)=>{
      if(data.status===200) {
        setUserChannel(data.data);
        setUserTabs(tabs(userId, data.data))
        setKeyIndex(1)
      }
    })
  },[userId])
  useEffect(()=>{
    if(keyIndex!==0){
      getUserBlock<IResponseType<IBlock[]>>(userId).then((data)=>{
        if(data.status===200){
          setBlock(data.data);
          if(data.data.length!==0){
            for(let item of data.data){
              if(item.name===UPLOADED_VIDEO){
                let tabList = [...userTabs,{
                  key:item.id,
                  label:item.name,
                  children:<UploadedVideo userId={userId}/>
                }];
                setUserTabs(tabList);
              }
            }
          }
        }
      })
    }
  },[keyIndex])
  const chatRouter=()=>{
    if(userId&& userChannel&&userChannel.user){
      navigate("/chatDetail",{
        state:{
          userId:userId,
          userName:userChannel!.user.userName
        }
      })
    }
  }
  return (
      <UserDetailWrapper>
        <div className={'banner'}>
          <img src={userChannel?.picUrl}/>
        </div>
        <div className="user-info">
          <div className="left">
            <div className="img-container">
              <img src={userChannel?.user.avatarUrl}/>
            </div>
            <div className="right-info">
              <div className="user-name">{userChannel?.user.userName}</div>
            </div>
          </div>
          <div className="control-btn">
            <div className="sub-btn">订阅</div>
            <div className="sub-btn message" onClick={e=>chatRouter()}>
              私信
            </div>
          </div>
        </div>
        {
          userTabs && userTabs.length!==0&& <Tabs
              defaultActiveKey="1"
              items={userTabs}
          />
        }
      </UserDetailWrapper>
  )
}
export default memo(UserDetail);