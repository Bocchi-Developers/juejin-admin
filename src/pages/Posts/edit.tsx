import { Input } from 'antd'
import { useEffect, useReducer, useRef } from 'react'

import type { VdRefObject } from '@/components/Editor'
import { Editor } from '@/components/Editor'
import { ContentLayout } from '@/components/layouts/content'
import { postByIdRequest } from '@/services/post'
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
    <ContentLayout>
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
    </ContentLayout>
  )
}

export default Edit
