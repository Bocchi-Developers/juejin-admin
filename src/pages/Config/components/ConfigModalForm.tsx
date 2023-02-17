import { Form, Input, Modal, Select } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import type { FC } from 'react'
import { useEffect, useState } from 'react'
import { message } from 'react-message-popup'

import {
  createCoreRequest,
  getCoreRequest,
  updateCoreRequest,
} from '@/services/core'
import type { CoreModel } from '@/types/api/core'

interface CoreModalFormProps {
  coreModalOpen: boolean
  setCoreModalOpen: (e: boolean) => void
}

export const CoreModalForm: FC<CoreModalFormProps> = ({
  coreModalOpen,
  setCoreModalOpen,
}) => {
  const [form] = Form.useForm<CoreModel>()
  const [isUpdate, setIsUpdate] = useState(false)
  const obSubmit = async (data: CoreModel) => {
    if (isUpdate) {
      await updateCoreRequest(data)
    } else {
      await createCoreRequest(data)
    }
    setCoreModalOpen(false)
    message.success('操作成功')
  }

  const fetchCoreData = async () => {
    const data = await getCoreRequest()
    setIsUpdate(!!data)
    form.setFieldsValue(data)
  }
  useEffect(() => {
    fetchCoreData()
  }, [])
  return (
    <Modal
      title={'网站核心配置'}
      open={coreModalOpen}
      onOk={() => form.submit()}
      onCancel={() => setCoreModalOpen(false)}
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
          name="description"
          label="描述"
          rules={[{ required: true, message: '请输入路径' }]}
        >
          <TextArea rows={4} />
        </Form.Item>

        <Form.Item
          name="keywords"
          label="关键字"
          rules={[{ required: true, message: '请添加关键字' }]}
        >
          <Select
            mode="tags"
            style={{ width: '100%' }}
            placeholder="请添加关键字"
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}
