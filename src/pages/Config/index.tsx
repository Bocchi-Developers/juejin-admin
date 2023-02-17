import { Button, Popconfirm, Space, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useEffect, useState } from 'react'
import message from 'react-message-popup'

import { ContentLayout } from '@/components/layouts/content'
import {
  createTabRequest,
  deleteTabRequest,
  getTabsRequest,
  updateTabRequest,
} from '@/services/config'
import type { TabModel } from '@/types/api/tab'

import { CoreModalForm } from './components/ConfigModalForm'
import { TabModalForm } from './components/TabModalForm'

const Config = () => {
  const [tab, settab] = useState<TabModel[]>()
  const [tabModalOpen, setTabModalOpen] = useState(false)
  const [coreModalOpen, setCoreModalOpen] = useState(false)
  const [defaultValue, setDefaultValue] = useState<TabModel>()
  const fetchtabData = async () => {
    const { data } = await getTabsRequest()
    settab(data)
  }

  const onSubmit = async (values: TabModel) => {
    if (defaultValue?._id) {
      await updateTabRequest(values, defaultValue._id)
    } else {
      await createTabRequest(values)
    }
    fetchtabData()
    setTabModalOpen(false)
    message.success('操作成功')
  }

  useEffect(() => {
    fetchtabData()
  }, [])

  const columns: ColumnsType<TabModel> = [
    {
      title: '名称',
      dataIndex: 'title',
      width: 150,
    },
    {
      title: '路径',
      dataIndex: 'slug',
      width: 500,
      render: (slug) => <span>{slug || '/'}</span>,
    },
    {
      title: '标签',
      dataIndex: 'tag',
      width: 150,
      render: (tag) => <span>{tag || '暂无'}</span>,
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: 100,
      render: (_, { title, _id, slug, tag }) =>
        slug && (
          <Space size={'middle'} className="cursor-pointer">
            <a
              onClick={() => {
                setDefaultValue({
                  _id,
                  title,
                  slug,
                  tag,
                })
                setTabModalOpen(true)
              }}
            >
              编辑
            </a>

            <Popconfirm
              title={`确认删除 ${name} 吗`}
              onConfirm={async () => {
                if (_id) {
                  await deleteTabRequest(_id)
                  message.success('删除成功')
                  fetchtabData()
                }
              }}
            >
              <a className="text-red-600">删除</a>
            </Popconfirm>
          </Space>
        ),
    },
  ]

  return (
    <ContentLayout
      actionsElement={
        <Space>
          <Button
            type="primary"
            danger
            onClick={() => {
              setCoreModalOpen(true)
            }}
          >
            核心配置
          </Button>
          <Button
            type="primary"
            onClick={() => {
              setDefaultValue(undefined)
              setTabModalOpen(true)
            }}
          >
            新增
          </Button>
        </Space>
      }
    >
      <Table
        columns={columns}
        dataSource={tab}
        pagination={false}
        rowKey={({ _id }) => _id || 'uid'}
      />
      <TabModalForm
        tabModalOpen={tabModalOpen}
        setTabModalOpen={setTabModalOpen}
        defaultValue={defaultValue}
        obSubmit={onSubmit}
      />

      <CoreModalForm
        coreModalOpen={coreModalOpen}
        setCoreModalOpen={setCoreModalOpen}
      />
    </ContentLayout>
  )
}

export default Config
