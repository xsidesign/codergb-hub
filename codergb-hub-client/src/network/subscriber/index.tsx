import gbRequest from "../index";
import {IResponseType} from "../../types/responseType";
export function sub<T=IResponseType<any>>(upId:string){
  return gbRequest.post<T>({
    url:"/sub/",
    data:{
      upId
    }
  })
}
export function cancelSub<T=IResponseType<any>>(upId:string){
  return gbRequest.post<T>({
    url:"/sub/cancel",
    data:{
      upId
    }
  })
}
//获取用户订阅
export function getUserSub<T=IResponseType<any>>(userId:string,offset:number,limit:number){
  return gbRequest.post<T>({
    url:"/sub/user/"+userId,
    data:{
      offset,
      limit
    }
  })
}