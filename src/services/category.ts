import type { CategoryModel } from '@/types/api/category'
import { request } from '@umijs/max'

export function getCategoryRequest() {
  return request<Record<'data', CategoryModel[]>>(`/category`, {
    method: 'Get',
  })
}
