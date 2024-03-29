import React, {memo, FC, useState} from "react";
import {
  CaretDownOutlined,
  CaretUpOutlined,
  DislikeFilled,
  DislikeOutlined,
  LikeFilled,
  LikeOutlined
} from "@ant-design/icons";
import {
  CommentItemWrapper
} from "./style"
import moment from "moment";
import Publish from "../../../publish";

import Reply from "../reply";
import {IComment} from "../../../../../types/comment/IComment";
import {IUserMsg} from "../../../../../types/user/IUserMsg";
import {useThumb, useTread} from "../../../../../hook/useThumb";
import {cancelThumb, cancelTread, thumb, tread} from "../../../../../network/thumb";
import {changeUserDetailAction} from "../../../../../views/login/store/actionCreators";
import {useDispatch, useSelector} from "react-redux";
import {Dispatch} from "redux";
import {Map} from "immutable";
import {ILogin} from "../../../../../types/login/ILogin";
interface IProps{
  comment:IComment,
  comIndex:number,
  index:number,
  replyIndex:number,
  user:IUserMsg,
  propsShowReplyHandle:(index:number)=>void,
  propsPublishReplyHandle:(content:string,item:IComment)=>void,
  propsShowReply:(index:number)=>void
}
const CommentItem:FC<IProps>=(props)=>{
  const { comment,comIndex,index ,replyIndex,user ,
          propsShowReplyHandle,propsPublishReplyHandle,propsShowReply} = props;
  const [tempReplyCount,setReplyCount]=useState<number>(0);
  const loginState = useSelector<Map<string,ILogin>,ILogin>(state=>{
    return state.getIn(['loginReducer','login']) as ILogin;
  })
  const isThumb = useThumb('comment',comment.id);
  const isTread = useTread('comment',comment.id);
  const dispatch = useDispatch<Dispatch<any>>();
  const showReplyHandle=(index:number)=>{
    propsShowReplyHandle(index);
  }
  const publishReplyHandle=(content:string,item:IComment)=>{
    propsPublishReplyHandle(content,item);
  }
  const showReply=(index:number)=>{
    propsShowReply(index);
  }
  const changeReplyCount = (count:number)=>{
    console.log(count)
    setReplyCount(count+1);
  }
  const thumbHandle=async ()=>{
    if(comment){
      console.log(isThumb)
      if(isThumb){
        const result = await cancelThumb(comment.id,"commentId");
        if(result.status===200){
          console.log(result.data)
        }
      }else{
        const result = await thumb(comment.id,"commentId");
        if(result.status===200){
          console.log(result.data)
        }
      }
      if(comment && comment.user && loginState && loginState.userMsg){
        dispatch(changeUserDetailAction(loginState.userMsg.userId));
      }
    }
  }
  const treadHandle= async ()=>{
    if(comment){
      if(!isTread){
        const result = await tread(comment.id,"commentId");
        if(result.status===200){
          console.log(result.data)
        }
      }else{
        const result = await cancelTread(comment.id,'commentId');
        if(result.status===200){
          console.log(result.data)
        }
      }
      if(comment && comment.user && loginState && loginState.userMsg){
        dispatch(changeUserDetailAction(loginState.userMsg.userId));
      }
    }
  }
  return (
      <CommentItemWrapper>
        <div className="comment-content">
          <div className="left-container">
            <img src={comment.user.avatarUrl}/>
          </div>
          <div className="right-container">
            <div className="user-name-time">
              <span className="user-name">{comment.user.userName}</span>
              <span className="create-time">{moment(comment.createTime).locale('zh-CN').fromNow()}</span>
            </div>
            <div className="content">
              {comment.content}
            </div>
            <div className="reply-controller-btn">
              <div className="thumb">
                {
                  (!isThumb)&&<LikeOutlined onClick={e=>thumbHandle()}/>
                }
                {
                  isThumb&&<LikeFilled onClick={e=>thumbHandle()}/>
                }
                <span className="thumb-count">18w</span>
              </div>
              <div className="tread">
                {
                  (!isTread)&&<DislikeOutlined onClick={e=>treadHandle()}/>
                }
                {
                  (isTread)&&<DislikeFilled onClick={e=>treadHandle()}/>
                }
              </div>
              <div className="reply-label" onClick={e=>showReplyHandle(index)}>
                回复
              </div>
            </div>
            {/* 发表回复 */}
            {
              (index === replyIndex) && <div className="publish-comment-reply-container">
                <Publish isShowAt={false} user={user} publish={(content:string)=>publishReplyHandle(content,comment)}/>
              </div>
            }
            {
              (typeof comment.reply==="number" && comment.reply!==0)&&<div className="reply-count-btn" onClick={e=>showReply(index)}>
                {
                  (index!==comIndex)&&<CaretDownOutlined />
                }
                {
                  index===comIndex &&<CaretUpOutlined />
                }
                <span className={"count"}>
                  {
                    tempReplyCount===0?(typeof comment.reply==="number"?comment.reply:'') : tempReplyCount
                  }
                </span>
                <span className={"label"}>条回复</span>
              </div>
            }
            {
              (index===comIndex)&& <Reply id={comment.id}
                                          user={user}
                                          replyHandle={(count)=>changeReplyCount(count)}/>
            }
          </div>
        </div>
      </CommentItemWrapper>
  )
}
export default memo(CommentItem)