import type { File } from './post'

export interface LoginReponseType {
  username: string
  token: string
  expiresIn: number
}

export interface LoginRequestType {
  username: string
  password: string
}

export interface UserModel {
  _id: string
  username: string
  admin: boolean
  created: string
  avatar: string | Avatar
  introduce: string
  password?: string
  create?: boolean
}

interface Avatar {
  fileList: File[]
}

export const TEMP_PASSWORD = 'TEMP_PASSWORD'
