import store from "./index";
import localCache from "../utils/cache"
import {changeLoginType, changeUserDetail, changeUserMsg} from "../views/login/store/actionCreators";
import {changeChannel} from "../views/profile/pages/customize/store/actionCreators";
//store.dispatch(changeUserDetail(localCache.getCache("userDetail")));
//console.log(localCache.getCache("userMsg"))
store.dispatch(changeUserMsg(localCache.getCache("userMsg")));
store.dispatch(changeLoginType(localCache.getCache("loginType")));
store.dispatch(changeUserDetail(localCache.getCache("userDetail")))
store.dispatch(changeChannel(localCache.getCache("channel")));
export {}
