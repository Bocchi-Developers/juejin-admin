import type { FormInstance } from 'antd'
import { Form, Input, Modal, Tabs, Upload } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import type { FC } from 'react'
import { useEffect } from 'react'
import message from 'react-message-popup'

import { UPLOAD_URL } from '@/services/upload'
import {
  queryUserName,
  userCreateRequest,
  userUpdateRequest,
} from '@/services/user'
import type { UserModel } from '@/types/api/user'
import { TEMP_PASSWORD } from '@/types/api/user'
import { getToken, removeToken } from '@/utils/cookie'
import { PlusOutlined } from '@ant-design/icons'
import { history, useModel } from '@umijs/max'

interface UserModalProps {
  open: boolean
  setOpen: (e: boolean) => void
}

export const UserModal: FC<UserModalProps> = ({ open, setOpen }) => {
  const [form] = Form.useForm<UserModel>()
  const { initialState } = useModel('@@initialState')
  const obSubmit = async (user: UserModel) => {
    let avatar = undefined
    if (typeof user.avatar !== 'string') {
      avatar = user?.avatar?.fileList[0]?.response?.data
    }

    const userQuery = await queryUserName(user.username)

    if (userQuery._id === initialState?.currentUser?._id) {
      let reLogin = false
      if (user.password === TEMP_PASSWORD) {
        user.password = undefined
      } else {
        reLogin = true
      }
      await userUpdateRequest({
        ...user,
        avatar: avatar || user.avatar,
        _id: initialState?.currentUser?._id || '',
      })

      if (reLogin) {
        removeToken()
        history.push('/login')
        message.success('密码修改成功，请重新登录')
      }
    } else {
      await userCreateRequest({
        ...user,
        avatar: avatar || user.avatar,
      })
    }
    message.success('操作成功')
    setOpen(false)
  }
  return (
    <Modal
      open={open}
      onOk={() => form.submit()}
      onCancel={() => setOpen(false)}
      destroyOnClose
    >
      <Form
        name="basic"
        wrapperCol={{ span: 18 }}
        style={{ maxWidth: 600 }}
        onFinish={(e) => obSubmit(e)}
        form={form}
        className="mt-6"
      >
        <Tabs
          defaultActiveKey="1"
          destroyInactiveTabPane
          items={[
            {
              label: '当前用户',
              key: '1',
              children: <UserForm form={form} />,
            },
            {
              label: '新增用户',
              key: '2',
              children: <UserForm form={form} create />,
            },
          ]}
        />
      </Form>
    </Modal>
  )
}

interface UserFormProps {
  form: FormInstance<UserModel>
  create?: boolean
}
const UserForm: FC<UserFormProps> = ({ form, create }) => {
  const { initialState } = useModel('@@initialState')

  useEffect(() => {
    form.resetFields()
    if (!create && initialState?.currentUser) {
      form.setFieldsValue({
        ...initialState?.currentUser,
        password: TEMP_PASSWORD,
      })
    } else {
      form.setFieldsValue({
        create,
      })
    }
  }, [create])
  return (
    <>
      <Form.Item
        name="username"
        label="名称"
        rules={[{ required: true, message: '请输入名称' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="password"
        label="密码"
        rules={[{ required: true, message: '请输入密码' }]}
      >
        <Input.Password visibilityToggle={false} />
      </Form.Item>

      <Form.Item
        name="introduce"
        label="描述"
        rules={[{ required: true, message: '请输入描述' }]}
      >
        <TextArea rows={4} />
      </Form.Item>

      <Form.Item
        name="avatar"
        label="头像"
        rules={[{ required: true, message: '请上传头像' }]}
      >
        <Upload
          action={UPLOAD_URL}
          headers={{ Authorization: getToken() || '' }}
          listType="picture-card"
          maxCount={1}
          defaultFileList={
            !create &&
            typeof initialState?.currentUser?.avatar == 'string' &&
            initialState?.currentUser?.avatar
              ? [
                  {
                    url: initialState?.currentUser.avatar,
                    uid: initialState?.currentUser.avatar,
                    name: initialState?.currentUser.avatar,
                  },
                ]
              : []
          }
        >
          <PlusOutlined />
        </Upload>
      </Form.Item>
    </>
  )
}
