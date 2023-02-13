import { LoginReponseType } from '@/types/api/user'
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
