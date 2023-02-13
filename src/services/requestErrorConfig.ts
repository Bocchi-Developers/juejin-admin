import message from 'react-message-popup'

import { getToken } from '@/utils/cookie'
import type { RequestOptions } from '@@/plugin-request/request'
import type { RequestConfig } from '@umijs/max'

// 与后端约定的响应数据格式
interface ResponseStructure {
  success: boolean
  code?: number
  message?: string
}

/**
 * @name 错误处理
 * pro 自带的错误处理， 可以在这里做自己的改动
 * @doc https://umijs.org/docs/max/request#配置
 */
export const errorConfig: RequestConfig = {
  baseURL: API_URL,
  timeout: 10000,
  // 错误处理： umi@3 的错误处理方案。
  errorConfig: {
    // 错误抛出
    errorThrower: (res) => {
      const { success, message, code } = res as unknown as ResponseStructure
      if (!success) {
        const error: any = new Error(message)
        error.name = 'BizError'
        error.info = { code, message }
        throw error // 抛出自制的错误
      }
    },
    // 错误接收及处理
    errorHandler: (error: any) => {
      const res = error.response.data as ResponseStructure
      const msg = res.message
      if (typeof msg === 'string') {
        message.error(msg)
      } else if (typeof msg === 'object') {
        message.error((msg as string[]).map((item: string) => item).join(' '))
      } else {
        message.error('服务器异常')
      }
    },
  },

  // 请求拦截器
  requestInterceptors: [
    (config: RequestOptions) => {
      // 拦截请求配置，进行个性化处理。
      config!.headers!['authorization'] = getToken() || ''
      return config
    },
  ],

  // 响应拦截器
  responseInterceptors: [
    (response) => {
      // 拦截响应数据，进行个性化处理

      return response
    },
  ],
}
