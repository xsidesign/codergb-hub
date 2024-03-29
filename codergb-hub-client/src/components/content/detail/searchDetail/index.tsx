import React, {memo, FC, useState, useEffect} from "react";
import {useLocation} from "react-router-dom";
import {
  SearchDetailWrapper
} from "./style"
import {IVideo} from "../../../../types/video/IVideo";
import {getAllVideo} from "../../../../network/video";
import {IResponseType} from "../../../../types/responseType";
import {IPage} from "../../../../types/IPage";
import VideoItem from "../../../videoItem";
const SearchDetail:FC=()=>{
  const location = useLocation();
  const { keyword } = location.state;
  const [video,setVideo] = useState<IVideo[]>([]);
  const [total,setTotal] = useState<number>(0);
  const getAllVideoReq=(offset:number,limit:number,keyword:string)=>{
    getAllVideo<IResponseType<IPage<IVideo[]>>>(offset,limit,keyword).then((data)=>{
      if(data.status===200){
        setVideo(data.data.list);
        setTotal(data.data.count);
      }
    })
  }
  useEffect(()=>{
    getAllVideoReq(0,15,keyword);
  },[keyword])
  return <SearchDetailWrapper>
    <ul className="search-list">
      {
        video&& video.length!==0&&video.map((item)=>{
          return <li key={item.id}>
             <VideoItem img={<img src={item.picUrl}/>}
                         isFlex={true}
                         state={item.name}
                         createTime={item.createTime}
                         scale={0.55}
                        itemWidth={330}
                        playCount={item.playCount}
                        dt={item.dt}
                        dtPos={{left:20,top:98}}
                        id={item.id}
                        vioHeight={152}
                        isShowUser={false}
                        isPosUser={true}
                       user={item.user}/>
          </li>
        })
      }
    </ul>
  </SearchDetailWrapper>
}
export default memo(SearchDetail);