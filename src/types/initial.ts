import type { Settings as LayoutSettings } from '@ant-design/pro-components'

import { UserModel } from './api/user'

export interface InitialStateType {
  currentUser?: UserModel
  settings?: Partial<LayoutSettings>
  fetchUserInfo?: () => Promise<UserModel | undefined>
}

export type InitialModel = Record<'initialState', InitialStateType>
