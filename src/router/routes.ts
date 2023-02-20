import { RoutePath } from './name'

export default [
  {
    name: 'login',
    path: RoutePath.LOGIN,
    layout: false,
    component: './Login',
  },
  {
    path: '/posts',
    name: '文章',
    icon: 'EditOutlined',
    routes: [
      {
        path: RoutePath.POSTS_VIEW,
        name: '管理',
        component: './Posts/view',
      },
      {
        path: RoutePath.POSTS_EDIT,
        name: '编写',
        icon: 'EditOutlined',
        component: './Posts/edit',
      },
      {
        path: RoutePath.POSTS_CATEGORY,
        name: '分类',
        access: 'canAdmin',
        component: './Posts/category',
      },
    ],
  },
  {
    path: RoutePath.AD,
    name: '广告',
    access: 'canAdmin',
    icon: 'NotificationOutlined',
    component: './Ad',
  },
  {
    path: RoutePath.CONFIG,
    name: '网站配置',
    access: 'canAdmin',
    icon: 'ToolOutlined',
    component: './Config',
  },
  {
    path: RoutePath.USER,
    name: '用户',
    access: 'canAdmin',
    icon: 'IdcardOutlined',
    component: './User',
  },
  {
    path: '/',
    redirect: '/user',
  },
]
