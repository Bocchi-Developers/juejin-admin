import type { TagModel } from '@/types/api/tab'
import { request } from '@umijs/max'

export function getTabsRequest() {
  return request<Record<'data', TagModel[]>>(`/tab`, {
    method: 'Get',
  })
}

export function deleteTabRequest(id: string) {
  return request(`/tab/${id}`, {
    method: 'Delete',
  })
}

export async function createTabRequest(category: TagModel) {
  return request('/tab', {
    method: 'POST',
    data: category,
  })
}

export async function updateTabRequest(post: TagModel, id: string) {
  return request(`/tab/${id}`, {
    method: 'PUT',
    data: post,
  })
}
