import {holder} from "../../utils/holder";
const HolderCpn=(total:number,lineCount:number,width:number)=>{
  return  holder(total,lineCount).map((item)=>{
            return <li style={{width:`${width/40}rem`,height:0,border:"none",padding:0,margin:0,outline:"none"}}> </li>
          })

}
export default HolderCpn;