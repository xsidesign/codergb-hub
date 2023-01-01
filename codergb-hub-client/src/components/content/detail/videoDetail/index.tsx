import React, {
  memo,
  FC,
  ReactElement,
  useState,
  useEffect,
  useRef,
  MutableRefObject,
  SyntheticEvent,
  RefObject, useMemo
} from "react";
import { useLocation } from "react-router-dom";
import moment from "moment";
import {
  VideoDetailWrapper,
  CenterContent,
  LeftContentWrapper,
  RightContentWrapper
} from "./style"
import {getVideoDetail, getVideoURL} from "../../../../network/video";
import {IResponseType} from "../../../../types/responseType";
import Hls from "hls.js";
import {IVideo} from "../../../../types/video/IVideo";
import VideoInfo from "./childCpn/videoInfo";
import Comment from "../../../common/comment";
import {useSelector} from "react-redux";
import {Map} from "immutable";
import {ILogin} from "../../../../types/login/ILogin";
import {addHistory} from "../../../../network/history";
import Dm from "./childCpn/dm";
import {IDm} from "../../../../types/dm/IDm";
import {getVideoDm} from "../../../../network/dm";
import {getRandom, getRandomStr} from "../../../../utils/getRandom";
const VideoDetail:FC=():ReactElement=>{
  const location = useLocation();
  const { id } = location.state;
  const [currentTime, setCurrentTime] = useState("");
  const [vioURL,setVioURL] = useState<string>("");
  const [vioId,setVioId] = useState<string>(id);
  const [videoDetail,setVideoDetail] = useState<IVideo>();
  const [videoDm,setVideoDm] = useState<(IDm&{contentRef:MutableRefObject<HTMLLIElement|null>})[]>();
  const videoRef = useRef<HTMLVideoElement>(null);
  const loginState = useSelector<Map<string,ILogin>,ILogin>(state=>{
    return state.getIn(['loginReducer','login']) as ILogin;
  })
  const contentRef = useRef<HTMLUListElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const itemRef = useRef<HTMLLIElement | null >(null)
  let arrRef:MutableRefObject<HTMLLIElement|null>[]=[];
  useEffect(()=>{
    getVideoDm<IResponseType<IDm[]>>(vioId).then((data)=>{
      if(data.data.length!==0){
        arrRef = [];
        for(let i=0; i<data.data.length; i++){
          arrRef.push(itemRef);
        }

        let list:(IDm & {contentRef:MutableRefObject<HTMLLIElement|null>})[] = data.data.map((item,index)=>{
          console.log(arrRef[index]);
          return {
            ...item,
            contentRef: arrRef[index],
          }
        })
        setVideoDm(list);
      }else{
        setVideoDm([]);
      }
      getVideoURL<IResponseType<{vioUrl:string}>>(id).then((data)=>{
        if(data.status===200){
          setVioURL(data.data.vioUrl);
        }
      })
    })

    getVideoDetail(vioId).then((data)=>{
      if(data.status===200){
        setVideoDetail(data.data)
      }
    })
  },[vioId])
  useEffect(()=>{
    if(videoRef.current){
      if(Hls.isSupported()){
        let hls = new Hls();
        hls.loadSource(vioURL);
        hls.attachMedia(videoRef.current)
        addHistory(vioId);
      }else if(videoRef.current.canPlayType("application/vnd.apple.mpegurl")){
        videoRef.current.src=vioURL;
      }
    }
  },[videoRef.current,vioURL]);
  const pubSuccess=()=>{
    getVideoDm<IResponseType<IDm[]>>(vioId).then((data)=>{
      if(data.data.length!==0){
        let list:(IDm & {contentRef:MutableRefObject<HTMLLIElement|null>})[] = data.data.map((item,index)=>{
          return {
            ...item,
            contentRef: arrRef[index],
          }
        })
        setVideoDm(list);
      }else{
        setVideoDm([]);
      }
    }
    )
  }
  const videoPlayHandle=(e:SyntheticEvent<HTMLVideoElement>)=>{
    if(videoDm){
      setCurrentTime(moment(e.currentTarget.currentTime * 1000).format("mm:ss"));
      for (let index=0;index < videoDm!.length;index++) {
        if (videoDm && screenRef.current) {
          let item = videoDm[index];
          if (
              moment(e.currentTarget.currentTime * 1000).format("mm:ss") === item.time && item.contentRef.current        ) {
            let r = getRandom(
                -screenRef.current.offsetHeight + index * item.contentRef.current.offsetHeight+item.contentRef.current.offsetHeight,
                index * item.contentRef.current.offsetHeight);
            let anName = getRandomStr(10);
            let keyframes = `
        @keyframes ${anName}{
          0%{
            transform :translateX(0) translateY(${r}px);
          }  
          100%{
            transform :translateX(${screenRef.current.offsetWidth+30+item.contentRef.current.offsetWidth}px) translateY(${r}px);
          }
        }
        `;
            let style = document.createElement("style");
            style.innerHTML = keyframes;
            let head = document.getElementsByTagName("head")[0];
            head.appendChild(style);
            item.contentRef.current.style.animation = `${anName} 16s normal`;
            item.contentRef.current.style.animationFillMode = `forwards`;
          }
        }

      }
    }
  }
  const pauseHandle=(item:IDm & {contentRef:MutableRefObject<HTMLLIElement | null>})=>{
    if(item.contentRef.current) item.contentRef.current.style.animationPlayState="paused"
  }
  const playHandle=(item:IDm & {contentRef:MutableRefObject<HTMLLIElement | null>})=>{
    if( item.contentRef.current) item.contentRef.current.style.animationPlayState="running"
  }
  return (
      <VideoDetailWrapper>
        <CenterContent>
          <LeftContentWrapper videoRef={videoRef}>
            <div className="video-dm-container">
              <div className="inner">
                <div className="start">
                  <ul ref={contentRef}>
                    {videoDm &&
                    videoDm.map((item, index) => {
                      return (
                          <li key={item.text} className="text" ref={item.contentRef} onMouseEnter={e=>pauseHandle(item)} onMouseLeave={e=>playHandle(item)}>
                            {item.text}
                          </li>
                      );
                    })}
                  </ul>
                </div>
                <div className="video-container" ref={screenRef}>
                  {
                    vioURL && <video ref={videoRef}
                                     controls={true}
                                     muted={false}
                                     onTimeUpdate={(e) => videoPlayHandle(e)}
                                     autoPlay={true}/>
                  }
                </div>
                <div className="end"> </div>
              </div>
            </div>
            <Dm id={vioId} time={currentTime} pub={()=>pubSuccess()}/>
            <div className="video-info">
              <VideoInfo videoInfo={videoDetail}/>
            </div>
            <div className="video-comment">
              {
                loginState && loginState.userMsg && videoDetail&&<Comment user={loginState.userMsg} id={videoDetail.id} alias={'vId'}/>
              }
            </div>
          </LeftContentWrapper>
          <RightContentWrapper>

          </RightContentWrapper>
        </CenterContent>
      </VideoDetailWrapper>
  )
}
export default memo(VideoDetail);