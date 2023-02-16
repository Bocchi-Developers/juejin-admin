import { Button, Form, Input, Modal, Popconfirm, Space, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { FC } from 'react'
import { useEffect, useMemo, useState } from 'react'
import message from 'react-message-popup'

import { ContentLayout } from '@/components/layouts/content'
import {
  createTabRequest,
  deleteTabRequest,
  getTabsRequest,
  updateTabRequest,
} from '@/services/config'
import type { TabModel } from '@/types/api/tab'

const Config = () => {
  const [tab, settab] = useState<TabModel[]>()
  const [modalOpen, setModalOpen] = useState(false)
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
    setModalOpen(false)
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
                setModalOpen(true)
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
        <Button
          type="primary"
          onClick={() => {
            setDefaultValue(undefined)
            setModalOpen(true)
          }}
        >
          新增
        </Button>
      }
    >
      <Table
        columns={columns}
        dataSource={tab}
        pagination={false}
        rowKey={({ _id }) => _id || 'uid'}
      />
      <ModalForm
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        defaultValue={defaultValue}
        obSubmit={onSubmit}
      />
    </ContentLayout>
  )
}

interface ModalFormProps {
  modalOpen: boolean
  setModalOpen: (e: boolean) => void
  defaultValue?: TabModel
  obSubmit?: (values: TabModel) => void
}

const ModalForm: FC<ModalFormProps> = ({
  modalOpen,
  setModalOpen,
  defaultValue,
  obSubmit,
}) => {
  const [form] = Form.useForm<TabModel>()
  const isUpdate = useMemo(() => !!defaultValue, [defaultValue])

  const handleCancel = () => {
    setModalOpen(false)
  }

  useEffect(() => {
    form.setFieldsValue({
      title: defaultValue?.title,
      slug: defaultValue?.slug,
      tag: defaultValue?.tag,
    })
  }, [defaultValue])
  return (
    <Modal
      title={isUpdate ? '编辑 Tab 栏' : '新增 Tab 栏'}
      open={modalOpen}
      onOk={() => form.submit()}
      onCancel={handleCancel}
      destroyOnClose
    >
      <Form
        name="basic"
        wrapperCol={{ span: 18 }}
        style={{ maxWidth: 600 }}
        onFinish={obSubmit}
        form={form}
        className="mt-6"
      >
        <Form.Item
          name="title"
          label="名称"
          rules={[{ required: true, message: '请输入名称' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="slug"
          label="路径"
          rules={[{ required: true, message: '请输入路径' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item name="tag" label="标签">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default Config
