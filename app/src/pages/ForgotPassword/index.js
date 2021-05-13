import { useSelector } from 'react-redux'

import CreateCode from '../../components/CreateCode/'
import ValidCode from '../../components/ValidCode/'
import ResetPassword from '../../components/ResetPassword/'

import './styles.css'

function ForgotPassword() {
  const user = useSelector((state) => state.user)
  if (!user.codeSend) return <CreateCode />
  else if (!user.code) return <ValidCode />
  else return <ResetPassword />
}

export default ForgotPassword
