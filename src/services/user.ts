import type { LoginReponseType, UserModel } from '@/types/api/user'
import { request } from '@umijs/max'

export interface ILoginForm {
  username: string
  password: string
}

export async function login(user: ILoginForm) {
  return request<LoginReponseType>('/user/login', {
    method: 'POST',
    data: user,
  })
}

export async function queryCurrentUser() {
  return request<UserModel>('/user/check_logged', {
    method: 'GET',
  })
}

export async function queryUserName(name: string) {
  return request<UserModel>(`/user/${name}`, {
    method: 'GET',
  })
}

export async function userCreateRequest(user: UserModel) {
  return request('/user/register', {
    method: 'POST',
    data: user,
  })
}

export async function userUpdateRequest(user: UserModel) {
  return request(`/user`, {
    method: 'PUT',
    data: user,
  })
}
