import { Modal } from 'antd'
import type { PropsWithChildren } from 'react'
import React from 'react'

import type { AD } from '@/services/advertisement'
import { advAdd } from '@/services/advertisement'
import type { ProColumns } from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'

interface CreateFormProps {
  modalVisible: boolean
  onCancel: () => void
  columns: ProColumns[]
  advUrl: string
  actionRef: any
}

const CreateForm: React.FC<PropsWithChildren<CreateFormProps>> = (props) => {
  const { modalVisible, onCancel, columns, advUrl, actionRef } = props
  return (
    <Modal
      destroyOnClose
      title="新建"
      width={420}
      open={modalVisible}
      onCancel={() => onCancel()}
      footer={null}
    >
      <ProTable
        onSubmit={async (value: AD) => {
          value.phoUrl = advUrl
          const success = await advAdd(value)
          console.log(success, 'submit')
          if (actionRef.current) {
            actionRef.current.reload()
          }
        }}
        rowKey="id"
        type="form"
        columns={columns}
      />
    </Modal>
  )
}

export default CreateForm
