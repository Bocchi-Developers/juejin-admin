import { defineConfig } from '@umijs/max'

import defaultSettings from './defaultSettings'
import routes from './routes'

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
      : 'https://juejin-core-production.up.railway.app/api/v1',
  },
})
