import {
  Button,
  Col,
  Drawer,
  Form,
  Input,
  Row,
  Select,
  Space,
  Switch,
  Upload,
} from 'antd'
import type { FC } from 'react'
import { useEffect, useReducer, useRef, useState } from 'react'
import { message } from 'react-message-popup'

import type { VdRefObject } from '@/components/Editor'
import { Editor } from '@/components/Editor'
import { ContentLayout } from '@/components/layouts/content'
import { getCategoryRequest } from '@/services/category'
import {
  postByIdRequest,
  postCreateRequest,
  postUpdateRequest,
} from '@/services/post'
import { UPLOAD_URL } from '@/services/upload'
import type { CategoryModel } from '@/types/api/category'
import type { IPostForm } from '@/types/api/post'
import { getToken } from '@/utils/cookie'
import { PlusOutlined } from '@ant-design/icons'
import { useNavigate, useSearchParams } from '@umijs/max'

export const initialPostState: InitialPostState = {
  title: '',
  content: '',
  category: '',
  cover: '',
  tags: [],
  ad: false,
}

export interface InitialPostState {
  id?: string
  title: string
  content: string
  category: string
  cover: string
  tags: string[]
  ad: boolean
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
  const update = searchParams.get('id')
  const vdRef = useRef<VdRefObject>(null)
  const [open, setOpen] = useState(false)
  const [allCategory, setAllCategory] = useState<CategoryModel[]>([])
  const nav = useNavigate()
  useEffect(() => {
    fetchPost()
  }, [])

  const onSubmit = async (form: IPostForm) => {
    const { category, tags, cover, ad } = form
    const _cover = cover?.fileList[0]?.response?.data
    const _category = allCategory.find((item) => item.name === category)?._id
    const data = {
      title: state.title,
      content: vdRef.current?.vd?.getValue() || '',
      category: _category || '',
      tags,
      cover: _cover,
      ad: ad || false,
    }
    if (update) {
      await postUpdateRequest(data, update)
      message.success('更新成功')
    } else {
      await postCreateRequest(data)
      message.success('创建成功')
    }

    nav('/posts/view')
  }

  const fetchPost = async () => {
    if (update) {
      const data = await postByIdRequest(update)
      const { title, content, tags, category, cover, ad } = data
      dispatch({
        type: 'set',
        data: {
          title,
          content,
          category: category.name,
          cover,
          tags,
          ad,
        },
      })
    }

    setAllCategory(
      (await getCategoryRequest()).data.filter((item) => item.name != '综合'),
    )
  }

  return (
    <ContentLayout
      actionsElement={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setOpen(true)}
        >
          {update ? '更新' : '发布'}
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
        {(state.content || !update) && (
          <Editor ref={vdRef} value={state.content} />
        )}
      </div>
      <EditDrawer
        onSubmit={onSubmit}
        open={open}
        setOpen={setOpen}
        allCategory={allCategory}
        state={state}
        update={!!update}
      />
    </ContentLayout>
  )
}

interface EditDrawerProps {
  onSubmit?: (e: IPostForm) => void
  open?: boolean
  setOpen?: (e: boolean) => void
  allCategory: CategoryModel[]
  state: InitialPostState
  update: boolean
}

const EditDrawer: FC<EditDrawerProps> = ({
  onSubmit,
  open,
  setOpen,
  allCategory,
  state,
  update,
}) => {
  const [form] = Form.useForm()
  const { category, ad, tags, cover } = state
  const onClose = () => {
    setOpen && setOpen(false)
  }
  return (
    <Drawer
      title="发布文章"
      width={400}
      onClose={onClose}
      open={open}
      bodyStyle={{ paddingBottom: 80 }}
      extra={
        <Space>
          <Form.Item>
            <Button
              onClick={() => {
                form.submit()
              }}
              type="primary"
              htmlType="submit"
            >
              {update ? '确认更新' : '确认发布'}
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
                rules={[{ required: true, message: '请选择分类' }]}
                initialValue={category}
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
              initialValue={tags}
            >
              <Select
                mode="tags"
                style={{ width: '100%' }}
                placeholder="请添加标签"
              />
            </Form.Item>
          </Col>

          <Col span={20}>
            <Form.Item label="是否为广告" name="ad" initialValue={ad}>
              <Switch />
            </Form.Item>
          </Col>

          <Col span={20}>
            <Form.Item name="cover" label="封面">
              <Upload
                action={UPLOAD_URL}
                headers={{ Authorization: getToken() || '' }}
                listType="picture-card"
                maxCount={1}
                defaultFileList={
                  cover
                    ? [
                        {
                          url: cover,
                          uid: cover,
                          name: cover,
                        },
                      ]
                    : []
                }
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
