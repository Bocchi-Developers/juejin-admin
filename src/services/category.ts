import type { CategoryModel } from '@/types/api/category'
import { request } from '@umijs/max'

export function getCategoryRequest() {
  return request<Record<'data', CategoryModel[]>>(`/category`, {
    method: 'Get',
  })
}

export function deleteCategoryRequest(id: string) {
  return request(`/category/${id}`, {
    method: 'Delete',
  })
}

export async function createCategoryRequest(category: CategoryModel) {
  return request('/category', {
    method: 'POST',
    data: category,
  })
}

export async function updateCategoryRequest(post: CategoryModel, id: string) {
  return request(`/category/${id}`, {
    method: 'PUT',
    data: post,
  })
}
