import type { CoreModel } from '@/types/api/core'
import { request } from '@umijs/max'

export function getCoreRequest() {
  return request<CoreModel>(`/option`, {
    method: 'Get',
  })
}

export async function createCoreRequest(category: CoreModel) {
  return request('/option', {
    method: 'POST',
    data: category,
  })
}

export async function updateCoreRequest(post: CoreModel) {
  return request(`/option`, {
    method: 'PUT',
    data: post,
  })
}
