import { IMoment } from '../moment';
import { IUserMsg } from '../user/IUserMsg';
import { IVideo } from '../video/IVideo';

interface IComment {
  id: string;
  content: string;
  createTime: string;
  updateTime: string;
  user: IUserMsg;
  reply?: IComment | number;
  video?: IVideo;
  moment?: IMoment;
}
export type { IComment };
