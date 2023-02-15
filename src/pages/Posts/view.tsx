import { Popconfirm, Table, Tag } from 'antd'
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table'
import React, { useEffect, useState } from 'react'

import { ContentLayout } from '@/components/layouts/content'
import { postListRequest } from '@/services/post'
import type { IPaginate, IPostList } from '@/types/api/post'
import { relativeTimeFromNow } from '@/utils/time'
import { Link } from '@umijs/max'

const columns: ColumnsType<IPostList> = [
  {
    title: '标题',
    dataIndex: 'title',
    width: 600,
    render: (text, { _id }) => <Link to={`/posts/edit?id=${_id}`}>{text}</Link>,
  },
  {
    title: '分类',
    dataIndex: 'category',
    render: (_, { category }) => <span>{category.name}</span>,
  },
  {
    title: '标签',
    key: 'tags',
    dataIndex: 'tags',
    render: (_, { tags }) => (
      <>
        {tags.map((tag) => {
          let color = tag.length > 5 ? 'geekblue' : 'green'
          if (tag === 'loser') {
            color = 'volcano'
          }
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          )
        })}
      </>
    ),
  },
  {
    title: '创建于',
    dataIndex: 'created',
    render: (created) => <span>{relativeTimeFromNow(created)}</span>,
  },
  {
    title: '修改于',
    dataIndex: 'updatedAt',
    render: (updatedAt) => <span>{relativeTimeFromNow(updatedAt)}</span>,
  },
  {
    title: '操作',
    dataIndex: 'action',
    render: (_, { title }) => (
      <Popconfirm
        title={`确认删除 ${title} 吗`}
        // onConfirm={() => handleDelete(record.key)}
      >
        <a>删除</a>
      </Popconfirm>
    ),
  },
]

const View = () => {
  const [data, setData] = useState<IPostList[]>()
  const [page, setPage] = useState<IPaginate>({
    pageCurrent: 1,
    pageSize: 10,
  })
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const fetchData = async () => {
    setLoading(true)
    const list = await postListRequest({
      pageCurrent: page.pageCurrent,
      pageSize: page.pageSize,
    })
    setTotalCount(list.totalCount)
    setData(list.postList)
    setLoading(false)
  }

  const handleTableChange = (pagination: TablePaginationConfig) => {
    setPage({
      pageCurrent: pagination.current || 1,
      pageSize: pagination.pageSize || 10,
    })
  }

  useEffect(() => {
    fetchData()
  }, [page])

  return (
    <ContentLayout>
      <Table
        pagination={{
          current: page.pageCurrent,
          pageSize: page.pageSize,
          total: totalCount,
        }}
        loading={loading}
        columns={columns}
        dataSource={data}
        onChange={handleTableChange}
      />
    </ContentLayout>
  )
}

export default View
