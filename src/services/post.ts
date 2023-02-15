import type {
  IPostListParam,
  IPostListResponse,
  IPostModel,
} from '@/types/api/post'
import { request } from '@umijs/max'

export function postListRequest(params: IPostListParam) {
  return request<IPostListResponse>('/post', {
    method: 'Get',
    params,
  })
}

export function postByIdRequest(id: string) {
  return request<IPostModel>(`/post/${id}`, {
    method: 'Get',
  })
}
