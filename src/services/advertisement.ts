import { request } from '@umijs/max'

export interface AD {
  phoUrl: string
  adHref: string
  putAdHref: string
}
// 广告查询
export function advFind() {
  return request('/advertisement', {
    method: 'GET',
  })
}

export function advAdd(adv: AD) {
  return request('/advertisement', {
    method: 'POST',
    data: adv,
  })
}

// 广告修改
export function advUpdate(adv: AD) {
  return request('/advertisement', {
    method: 'PUT',
    data: adv,
  })
}
// 广告删除
export function advDelete(id: string) {
  return request(`/advertisement/${id}`, {
    method: 'DELETE',
  })
}
