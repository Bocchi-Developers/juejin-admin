import { InitialModel } from '@/types/initial'
import { useModel } from '@umijs/max'

const User = () => {
  const {
    initialState: { currentUser },
  } = useModel('@@initialState') as InitialModel

  return (
    <div>
      <h1>{currentUser?.username}</h1>
    </div>
  )
}

export default User
