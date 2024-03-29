import React, {
  memo,
  FC,
  ChangeEvent,
  useState,
  forwardRef,
  useRef,
  useImperativeHandle, Ref, useEffect,
} from "react";
import {CloudUploadOutlined} from "@ant-design/icons"
import { Progress,Spin  } from "antd"
import {
  UploadVideoWrapper
} from "./style"
import {shardUtils} from "../../../../utils/shard";
import VideoInfo from "./childCpn/videoInfo";
import {IUploadVideo} from "../../../../types/imperative/uploadVideo";
interface IProps{
  keyIndex:number,
  ref:Ref<IUploadVideo>
}
const UploadVideo:FC<IProps>=forwardRef<IUploadVideo,IProps>((props,propsRef)=>{
  const { keyIndex } = props;
  const [file,setFile] = useState<File|null>(null);
  //const [childKeyIndex,setChildKeyIndex] = useState<number>(keyIndex);
  const [videoURL,setVideoURL]=useState<string>("");
  const [videoName,setVideoName]=useState<string>("");
  const [videoId,setVideoId]=useState<string>("");
  const [percent,setPercent] = useState<number>(0);
  const [isShowUpload,setIsShowUpload]=useState<boolean>(true);
  const [isShowLoading,setIsShowLoading] = useState<boolean>(false);
  const videoInfoRef = useRef<IUploadVideo>({title:"",desc:"",playlist:"",tag:[],cate:"",imgId:"",videoId:"",file:null});

  useImperativeHandle<IUploadVideo,IUploadVideo>(propsRef,()=>{
    return {
      videoId:videoId,
      title:videoInfoRef.current.title,
      desc:videoInfoRef.current.desc,
      playlist:videoInfoRef.current.playlist,
      tag:videoInfoRef.current.tag,
      cate:videoInfoRef.current.cate,
      imgId:videoInfoRef.current.imgId,
      file:file
    }
  },[videoInfoRef.current,videoId,keyIndex,file])
  const fileChangeHandle=async (e:ChangeEvent<HTMLInputElement>)=>{
    if(e.currentTarget.files && e.currentTarget.files.length!==0){
      const file = e.currentTarget.files[0];
      setVideoURL(URL.createObjectURL(file));
      setVideoName(file.name);

      setFile(file);
      setPercent(0);
      setIsShowUpload(false);
      const result = await shardUtils(file,(e)=>{
        setPercent(e/file.size*100);
      },(e)=>{
        setPercent(e);
        if(!isShowLoading){
          setIsShowLoading(true);
        }
      });
      if(result.status ===200){
        setVideoId(result.data.id);
        setPercent(100);
        setIsShowLoading(false);
      }
    }
  }

  return (
      <UploadVideoWrapper>
        {
          isShowUpload && <div className="upload">
            <button className="select-btn">选择文件</button>
            <p className="upload-label">请选择您要上传的文件</p>
            <CloudUploadOutlined className="upload-icon"/>
            <input type='file' className="file-inp" onChange={(e)=>fileChangeHandle(e)}/>
          </div>
        }
        {
          (!isShowUpload) && <VideoInfo videoURL={videoURL}
                                        videoName={videoName}
                                        ref={videoInfoRef}  />
        }
        {
          (!isShowUpload) && <Progress percent={parseFloat(percent.toFixed(2))}/>
        }
        {
          (isShowLoading) &&<div className="video-upload-loading">
            <Spin className="video-upload-loading-icon"/>
            <div className="label">视频处理中...</div>
          </div>
        }
      </UploadVideoWrapper>
  )
})
export default memo(UploadVideo)