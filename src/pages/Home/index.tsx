import Guide from '@/components/Guide'
import { trim } from '@/utils/format'
import { PageContainer } from '@ant-design/pro-components'
import { useModel } from '@umijs/max'

import styles from './index.less'

const HomePage: React.FC = () => {
  const { name } = useModel('global')
  return (
    <PageContainer ghost>
      <div className={styles.container}>
        <Guide name={trim(name)} />
        <div className="text-blue-500">123121</div>
      </div>
    </PageContainer>
  )
}

export default HomePage
