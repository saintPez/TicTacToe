import { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import Joi from 'joi'

import { resetUser } from '../../actions/user.actions'
import instance from '../../axios'
import validate from '../../utils/validate'

import './styles.css'

const passwordSchema = Joi.object({
  password: Joi.string().min(5).required(),
})

function ResetPassword() {
  const user = useSelector((state) => state.user)
  const history = useHistory()
  const dispatch = useDispatch()
  const [data, setData] = useState({ password: '' })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!(!data.errorPassword || data.errorPassword?.status)) {
      instance
        .post(`/auth/password/${user.email}/${user.code}`, {
          password: data.password,
        })
        .then(() => {
          history.push('/home')
          dispatch(resetUser({}))
        })
        .catch((error) => {
          console.log(error.response)
          setData({
            ...data,
            errorPassword: {
              status: true,
              message: error.response?.data.message,
            },
          })
        })
    }
  }

  return (
    <>
      <main>
        <form onSubmit={handleSubmit}>
          <h1>Forgot password</h1>
          <div className="input">
            <input
              onChange={(e) => {
                setData({ ...data, password: e.target.value })
              }}
              onBlur={(e) => {
                const result = validate(
                  passwordSchema.validate({
                    password: e.target.value,
                  })
                )

                setData({
                  ...data,
                  errorPassword: {
                    ...result,
                  },
                })
              }}
              className={data.errorPassword?.status ? 'error' : ''}
              placeholder="Password"
              type="text"
              value={data.password}
            />
            <label className={data.errorPassword?.status ? 'error' : ''}>
              {data.errorPassword?.message}
            </label>
          </div>
          <button className="button">Send</button>
        </form>
      </main>
    </>
  )
}

export default ResetPassword
