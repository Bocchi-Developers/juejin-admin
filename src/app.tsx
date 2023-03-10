// 运行时配置

import type { Settings as LayoutSettings } from '@ant-design/pro-components'
import { history } from '@umijs/max'
import type { RunTimeLayoutConfig } from '@umijs/max'

import defaultSettings from '../config/defaultSettings'
import RightContent from './components/RightContent'
import { errorConfig } from './services/requestErrorConfig'
import { queryCurrentUser } from './services/user'
import type { InitialStateType } from './types/initial'

const loginPath = '/login'

export async function getInitialState(): Promise<InitialStateType> {
  const fetchUserInfo = async () => {
    try {
      const msg = await queryCurrentUser()
      return msg
    } catch (error) {
      history.push(loginPath)
    }
    return undefined
  }
  // 如果不是登录页面，执行
  const { location } = history
  if (location.pathname !== loginPath) {
    const currentUser = await fetchUserInfo()
    return {
      fetchUserInfo,
      currentUser,
      settings: defaultSettings as Partial<LayoutSettings>,
    }
  }
  return {
    fetchUserInfo,
    settings: defaultSettings as Partial<LayoutSettings>,
  }
}

export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  return {
    rightContentRender: () => <RightContent />,

    onPageChange: () => {
      const { location } = history
      // // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath)
      }
    },
    ...initialState?.settings,
    // menu: {
    //   defaultOpenAll: true,
    // },
  }
}

export const request = {
  ...errorConfig,
}
