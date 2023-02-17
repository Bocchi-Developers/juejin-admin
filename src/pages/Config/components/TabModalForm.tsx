import { Form, Input, Modal } from 'antd'
import type { FC } from 'react'
import { useEffect, useMemo } from 'react'

import type { TabModel } from '@/types/api/tab'

interface TabModalFormProps {
  tabModalOpen: boolean
  setTabModalOpen: (e: boolean) => void
  defaultValue?: TabModel
  obSubmit?: (values: TabModel) => void
}

export const TabModalForm: FC<TabModalFormProps> = ({
  tabModalOpen,
  setTabModalOpen,
  defaultValue,
  obSubmit,
}) => {
  const [form] = Form.useForm<TabModel>()
  const isUpdate = useMemo(() => !!defaultValue, [defaultValue])

  const handleCancel = () => {
    setTabModalOpen(false)
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
      open={tabModalOpen}
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
