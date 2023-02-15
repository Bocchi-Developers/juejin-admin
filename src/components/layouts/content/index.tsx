import type { FC, PropsWithChildren } from 'react'

import { useRouteData } from '@umijs/max'

export const ContentLayout: FC<PropsWithChildren> = ({ children }) => {
  const route = useRouteData() as any
  return (
    <div className="flex gap-4 flex-col">
      <h1 className="text-2xl">{route.route.name}</h1>
      {children}
    </div>
  )
}
