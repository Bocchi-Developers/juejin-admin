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
  avatar: string
  introduce: string
}
