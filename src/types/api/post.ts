export interface IPaginate {
  pageCurrent: number
  pageSize: number
}

export type Sort =
  | 'newest'
  | 'three_days_hottest'
  | 'weekly_hottest'
  | 'monthly_hottest'
  | 'hottest'

export interface IPostListParam extends IPaginate {
  categoryId?: string
  tag?: string
  sort?: Sort
  category?: string
}

export interface IPostListResponse {
  postList: IPostList[]
  totalCount: number
  totalPages: number
}

export interface IPostList {
  _id: string
  id: string
  title: string
  tags: string[]
  category: Category
  user: User
  cover?: string
  created: Date
  updatedAt: Date
  content: string
  ad: boolean
  read: number
}

export interface IPostModel extends IPostList {
  related: IPostList[]
}

export interface Category {
  _id: string
  name: string
  slug: string
  created: Date
}

interface User {
  _id: string
  username: string
  admin: boolean
  created: Date
  avatar: string
  introduce: string
}

export interface IPostForm {
  tags: string[]
  cover: Cover
  category: string
  ad: boolean
}

interface Cover {
  fileList: File[]
}

export interface File {
  uid: string
  lastModified: number
  lastModifiedDate: string
  name: string
  size: number
  type: string
  percent: number
  status: string
  response: {
    data: string
  }
}
