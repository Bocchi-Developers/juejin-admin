import { Button, Divider, Upload, message } from 'antd'
import type { UploadProps } from 'antd'
import type { UploadFile } from 'antd/es/upload/interface'
import React, { useRef, useState } from 'react'

import { advDelete, advFind } from '@/services/advertisement'
import { getToken } from '@/utils/cookie'
import { PlusOutlined } from '@ant-design/icons'
import type {
  ActionType,
  ProDescriptionsItemProps,
} from '@ant-design/pro-components'
import { PageContainer, ProTable } from '@ant-design/pro-components'

import CreateForm from './components/CreateForm'
import UpdateForm from './components/UpdateForm'

export const TableList: React.FC<unknown> = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false)
  const [updateModalVisible, handleUpdateModalVisible] =
    useState<boolean>(false)
  const [stepFormValues, setStepFormValues] = useState({})
  const actionRef = useRef<ActionType>()
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [advUrl, setAdvUrl] = useState<string>('')

  const columns: ProDescriptionsItemProps[] = [
    {
      title: '图片上传',
      hideInTable: true,
      renderFormItem: () => {
        const lists: UploadProps = {
          name: 'file',
          method: 'POST',
          action: 'http://127.0.0.1:7498/upload/album',
          onChange(info) {
            setFileList([info.file])
            if (info.file.response) {
              setAdvUrl(info.file.response.data)
            }
          },
          beforeUpload: async () => {
            const result = await advFind()
            if (result) {
              message.error('已有广告，请点击对应列表修改')
              return false
            }
            return true
          },
        }
        return (
          <Upload
            {...lists}
            fileList={fileList}
            listType="picture-card"
            headers={{ authorization: getToken() || '' }}
            maxCount={1}
          >
            <PlusOutlined />
          </Upload>
        )
      },
    },
    {
      title: '图片地址',
      dataIndex: 'phoUrl',
      hideInForm: true,
      render: (_: any) => (
        <a href={_} target="_blank">
          {_}
        </a>
      ),
    },
    {
      title: 'adHref',
      dataIndex: 'adHref',
      valueType: 'text',
    },
    {
      title: 'putAdHref',
      dataIndex: 'putAdHref',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <a
            onClick={() => {
              handleUpdateModalVisible(true)
              setStepFormValues(record)
            }}
          >
            修改
          </a>
          <Divider type="vertical" />
          <a
            onClick={async () => {
              await advDelete(record._id)
              if (actionRef.current) {
                actionRef.current.reload()
              }
            }}
          >
            删除
          </a>
        </>
      ),
    },
  ]

  return (
    <PageContainer
      header={{
        title: '广告模块',
      }}
    >
      <ProTable
        actionRef={actionRef}
        rowKey="_id"
        search={false}
        toolBarRender={() => [
          <Button
            key="1"
            type="primary"
            onClick={() => handleModalVisible(true)}
          >
            新建
          </Button>,
        ]}
        request={async () => {
          const result = await advFind()
          if (!result) {
            return {
              data: [],
              success: true,
            }
          }
          const arr = [result]
          return {
            data: arr || [],
            success: true,
          }
        }}
        columns={columns}
      />
      <CreateForm
        onCancel={() => handleModalVisible(false)}
        modalVisible={createModalVisible}
        columns={columns}
        advUrl={advUrl}
        actionRef={actionRef}
      />
      {stepFormValues && Object.keys(stepFormValues).length ? (
        <UpdateForm
          onCancel={() => {
            handleUpdateModalVisible(false)
            setStepFormValues({})
          }}
          handleUpdateModalVisible={handleUpdateModalVisible}
          updateModalVisible={updateModalVisible}
          values={stepFormValues}
          actionRef={actionRef}
        />
      ) : null}
    </PageContainer>
  )
}
