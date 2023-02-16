import { Button, Form, Input, Modal, Popconfirm, Space, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { FC } from 'react'
import { useEffect, useMemo, useState } from 'react'
import message from 'react-message-popup'

import { ContentLayout } from '@/components/layouts/content'
import {
  createCategoryRequest,
  deleteCategoryRequest,
  getCategoryRequest,
  updateCategoryRequest,
} from '@/services/category'
import type { CategoryModel } from '@/types/api/category'

const Category = () => {
  const [category, setCategory] = useState<CategoryModel[]>()
  const [modalOpen, setModalOpen] = useState(false)
  const [defaultValue, setDefaultValue] = useState<CategoryModel>()
  const fetchCategoryData = async () => {
    const { data } = await getCategoryRequest()
    setCategory(data)
  }

  const onSubmit = async (values: CategoryModel) => {
    if (defaultValue?._id) {
      await updateCategoryRequest(values, defaultValue._id)
    } else {
      await createCategoryRequest(values)
    }
    fetchCategoryData()
    setModalOpen(false)
    message.success('操作成功')
  }

  useEffect(() => {
    fetchCategoryData()
  }, [])

  const columns: ColumnsType<CategoryModel> = [
    {
      title: '名称',
      dataIndex: 'name',
      width: 300,
    },
    {
      title: '路径',
      dataIndex: 'slug',
      width: 300,
      render: (slug) => <span>{slug || '暂无'}</span>,
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: 100,
      render: (_, { name, _id, slug }) => (
        <Space size={'middle'} className="cursor-pointer">
          <a
            onClick={() => {
              setDefaultValue({
                _id,
                name,
                slug: name !== '综合' ? slug : undefined,
              })
              setModalOpen(true)
            }}
          >
            编辑
          </a>
          {name !== '综合' && (
            <Popconfirm
              title={`确认删除 ${name} 吗`}
              onConfirm={async () => {
                if (_id) {
                  await deleteCategoryRequest(_id)
                  message.success('删除成功')
                  fetchCategoryData()
                }
              }}
            >
              <a className="text-red-600">删除</a>
            </Popconfirm>
          )}
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
        dataSource={category}
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
  defaultValue?: CategoryModel
  obSubmit?: (values: CategoryModel) => void
}

const ModalForm: FC<ModalFormProps> = ({
  modalOpen,
  setModalOpen,
  defaultValue,
  obSubmit,
}) => {
  const [form] = Form.useForm()
  const isUpdate = useMemo(() => !!defaultValue, [defaultValue])

  const handleCancel = () => {
    setModalOpen(false)
  }

  useEffect(() => {
    form.setFieldsValue({
      name: defaultValue?.name,
      slug: defaultValue?.slug,
    })
  }, [defaultValue])

  return (
    <Modal
      title={isUpdate ? '编辑分类' : '新增分类'}
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
          name="name"
          label="名称"
          rules={[{ required: true, message: '请输入名称' }]}
        >
          <Input />
        </Form.Item>

        {(defaultValue?.slug || !defaultValue) && (
          <Form.Item
            name="slug"
            label="路径"
            rules={[{ required: true, message: '请输入路径' }]}
          >
            <Input />
          </Form.Item>
        )}
      </Form>
    </Modal>
  )
}

export default Category
