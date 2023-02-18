import { defineConfig } from '@umijs/max'

import routes from '../src/router/routes'
import defaultSettings from './defaultSettings'

const { UMI_ENV } = process.env
const isDev = UMI_ENV === 'dev'
export default defineConfig({
  title: '掘金后台',
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {
    dataField: '',
  },
  layout: {
    locale: true,
    ...defaultSettings,
  },
  routes,
  npmClient: 'pnpm',
  tailwindcss: {},
  define: {
    API_URL: isDev
      ? 'http://127.0.0.1:7498'
      : 'http://api-juejin.suemor.com/api/v1',
  },
})
