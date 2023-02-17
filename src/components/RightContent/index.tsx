import type { MenuProps } from 'antd'
import { Avatar, Dropdown, Space } from 'antd'
import React from 'react'
import { message } from 'react-message-popup'

import { removeToken } from '@/utils/cookie'
import { history, useModel } from '@umijs/max'

const GlobalHeaderRight: React.FC = () => {
  const { initialState } = useModel('@@initialState')

  if (!initialState) {
    return null
  }
  const { currentUser } = initialState
  const items: MenuProps['items'] = [
    {
      key: '1',
      label: '退出登录',
      onClick: () => {
        removeToken()
        message.success('退出成功')
        history.replace('/login')
      },
    },
  ]

  return (
    <Dropdown menu={{ items }}>
      <Space className="hover:bg-gray-100 px-1 rounded-md transition-all duration-100 cursor-pointer">
        <Avatar src={currentUser?.avatar} />
        <span className="text-md">{currentUser?.username}</span>
      </Space>
    </Dropdown>
  )
}
export default GlobalHeaderRight
