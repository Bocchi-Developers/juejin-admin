import type { InitialPostState } from '@/pages/Posts/edit'
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

export async function postCreateRequest(post: InitialPostState) {
  return request('/post', {
    method: 'POST',
    data: post,
  })
}

export async function postUpdateRequest(post: InitialPostState, id: string) {
  return request(`/post/${id}`, {
    method: 'PUT',
    data: post,
  })
}

export function postDeleteRequest(id: string) {
  return request(`/post/${id}`, {
    method: 'Delete',
  })
}
