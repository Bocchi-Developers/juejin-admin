export default [
  {
    name: 'login',
    path: '/login',
    layout: false,
    component: './Login',
  },
  {
    path: '/posts',
    name: '文章',
    icon: 'EditOutlined',
    routes: [
      {
        path: '/posts/view',
        name: '管理',
        component: './Posts/view',
      },
      {
        path: '/posts/edit',
        name: '编写',
        icon: 'EditOutlined',
        component: './Posts/edit',
      },
      {
        path: '/posts/category',
        name: '分类',
        access: 'canAdmin',
        component: './Posts/category',
      },
    ],
  },
]
