import { defineConfig } from '@umijs/max'

import defaultSettings from './defaultSettings'
import routes from './routes'

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
    API_URL: 'http://127.0.0.1:7498',
  },
})
