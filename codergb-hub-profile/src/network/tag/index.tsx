import gbRequest from '../index';
import { IResponseType } from '@/types/responseType';
export function getAllTag<T = IResponseType<any>>(offset: number, limit: number) {
  return gbRequest.get<T>({
    url: '/tag/all',
    params: {
      offset,
      limit
    }
  });
}
export function deleteTag<T = IResponseType<any>>(id: string) {
  return gbRequest.post<T>({
    url: '/tag/delete/' + id
  });
}
export function createTag<T = IResponseType<any>>(name: string) {
  return gbRequest.post<T>({
    url: '/tag/',
    data: {
      name
    }
  });
}
