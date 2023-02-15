import { Button, Form, Input, Modal, Upload } from 'antd'
import type { UploadProps } from 'antd'
import type { UploadFile } from 'antd/es/upload/interface'
import React, { useState } from 'react'

import { advUpdate } from '@/services/advertisement'
import { getToken } from '@/utils/cookie'
import { objBlank, reqName } from '@/utils/format'
import { PlusOutlined } from '@ant-design/icons'

export const UpdateForm = (props: any) => {
  const {
    updateModalVisible,
    handleUpdateModalVisible,
    onCancel,
    values,
    actionRef,
  } = props
  const name = reqName(values.phoUrl)
  const newValues: any = objBlank(values)
    ? {
        uid: values.uid,
        name,
        status: 'done',
      }
    : {}
  const [fileList, setFileList] = useState<UploadFile[]>([newValues])

  const lists: UploadProps = {
    name: 'file',
    method: 'POST',
    action: 'http://127.0.0.1:7498/upload/album',
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info) {
      setFileList([info.file])
    },
  }

  const onFinish = async (values: any) => {
    await advUpdate(values)
    handleUpdateModalVisible(false)
    if (actionRef.current) {
      actionRef.current.reload()
    }
  }
  const normFile = (e: any) => {
    const result = e.file.response
    if (result) {
      return result.data
    }
  }
  return (
    <Modal
      destroyOnClose
      title="修改"
      width={420}
      open={updateModalVisible}
      onCancel={() => onCancel()}
      footer={null}
    >
      <Form onFinish={onFinish}>
        <Form.Item label="图片上传" name="phoUrl" getValueFromEvent={normFile}>
          <Upload
            {...lists}
            fileList={fileList}
            listType="picture-card"
            headers={{ authorization: getToken() || '' }}
            maxCount={1}
          >
            <PlusOutlined />
          </Upload>
        </Form.Item>
        <Form.Item label="adHref" name="adHref" labelCol={{ span: 5 }}>
          <Input />
        </Form.Item>
        <Form.Item label="putAdHref" name="putAdHref">
          <Input />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            提交
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default UpdateForm
