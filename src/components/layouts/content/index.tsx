import type { FC, PropsWithChildren, ReactNode } from 'react'

import { useRouteData } from '@umijs/max'

interface ContentLayoutProps extends PropsWithChildren {
  actionsElement?: ReactNode
}

export const ContentLayout: FC<ContentLayoutProps> = ({
  children,
  actionsElement,
}) => {
  const route = useRouteData() as any
  return (
    <div className="flex gap-4 flex-col">
      <div className="flex justify-between">
        <h1 className="text-2xl">{route.route.name}</h1>
        {actionsElement}
      </div>
      {children}
    </div>
  )
}
