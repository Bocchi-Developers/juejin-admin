import {
  Button,
  Col,
  Drawer,
  Form,
  Input,
  Row,
  Select,
  Space,
  Upload,
} from 'antd'
import { useEffect, useReducer, useRef, useState } from 'react'

import type { VdRefObject } from '@/components/Editor'
import { Editor } from '@/components/Editor'
import { ContentLayout } from '@/components/layouts/content'
import { getCategoryRequest } from '@/services/category'
import { postByIdRequest } from '@/services/post'
import { UPLOAD_URL } from '@/services/upload'
import type { CategoryModel } from '@/types/api/category'
import { getToken } from '@/utils/cookie'
import { PlusOutlined } from '@ant-design/icons'
import { useSearchParams } from '@umijs/max'

export const initialPostState: InitialPostState = {
  title: '',
  content: '',
  category: '',
  cover: '',
  tags: [],
}

interface InitialPostState {
  title: string
  content: string
  category: string
  cover: string
  tags: string[]
}

type Action =
  | { type: 'set'; data: Partial<typeof initialPostState> }
  | { type: 'reset' }

const useFormData = () => {
  const [state, dispatch] = useReducer(
    (state: typeof initialPostState, payload: Action) => {
      switch (payload.type) {
        case 'set':
          return { ...state, ...payload.data }
        case 'reset':
          return initialPostState
      }
    },
    { ...initialPostState },
  )
  return [state, dispatch] as const
}

const Edit = () => {
  const [searchParams, _] = useSearchParams()
  const [state, dispatch] = useFormData()
  const id = searchParams.get('id')
  const vdRef = useRef<VdRefObject>(null)
  useEffect(() => {
    fetchPost()
  }, [])

  const fetchPost = async () => {
    if (id) {
      const data = await postByIdRequest(id)
      const { title, content, tags, category, cover } = data
      dispatch({
        type: 'set',
        data: {
          title,
          content,
          category: category.name,
          cover,
          tags,
        },
      })
    }
  }

  return (
    <ContentLayout
      actionsElement={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          // onClick={showDrawer}
        >
          发布
        </Button>
      }
    >
      <div className="flex flex-col gap-4">
        <Input
          size="large"
          placeholder="请输入标题"
          onChange={(e) => {
            dispatch({ type: 'set', data: { title: e.target.value } })
          }}
          value={state.title}
        />
        {(state.content || !id) && <Editor ref={vdRef} value={state.content} />}
      </div>
      <EditDrawer />
    </ContentLayout>
  )
}

const EditDrawer = () => {
  const [state, dispatch] = useFormData()
  const [open, setOpen] = useState(false)
  const [allCategory, setAllCategory] = useState<CategoryModel[]>([])
  const [form] = Form.useForm()
  const onClose = () => {
    setOpen(false)
    form.submit()
  }

  useEffect(() => {
    ;(async () => {
      const { data } = await getCategoryRequest()
      setAllCategory(data)
    })()
  }, [])

  // const onSubmit = (e) => {
  //   // console.log(e,' =====================');
  // }

  return (
    <Drawer
      title="发布文章"
      width={400}
      onClose={onClose}
      open={true}
      bodyStyle={{ paddingBottom: 80 }}
      extra={
        <Space>
          <Form.Item>
            <Button onClick={onClose} type="primary" htmlType="submit">
              确认发布
            </Button>
          </Form.Item>
        </Space>
      }
    >
      <Form layout="vertical" onFinish={onSubmit} form={form}>
        <Row gutter={16}>
          {allCategory.length > 0 && (
            <Col span={20}>
              <Form.Item
                name="category"
                label="分类"
                rules={[{ required: true, message: 'Please enter user name' }]}
              >
                <Select
                  placeholder="请选择"
                  options={allCategory.map((item) => ({
                    label: item.name,
                    value: item.name,
                  }))}
                />
              </Form.Item>
            </Col>
          )}

          <Col span={20}>
            <Form.Item
              name="tags"
              label="标签"
              rules={[{ required: true, message: '请添加标签' }]}
            >
              <Select
                mode="tags"
                style={{ width: '100%' }}
                placeholder="请添加标签"
              />
            </Form.Item>
          </Col>

          <Col span={20}>
            <Form.Item
              name="cover"
              label="封面"
              rules={[{ required: true, message: 'Please enter user name' }]}
              valuePropName="fileList"
            >
              <Upload
                action={UPLOAD_URL}
                headers={{ Authorization: getToken() || '' }}
                listType="picture-card"
              >
                <PlusOutlined />
              </Upload>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Drawer>
  )
}
export default Edit
