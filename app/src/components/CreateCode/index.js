import { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import Joi from 'joi'

import { updateUser } from '../../actions/user.actions'
import instance from '../../axios'
import validate from '../../utils/validate'

import './styles.css'

const emailSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
})

function CreateCode() {
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const history = useHistory()
  const [data, setData] = useState({ email: '' })

  useEffect(() => {
    if (user.email) {
      instance
        .post('/auth/code', {
          email: user.email,
        })
        .then(() => {
          dispatch(updateUser({ codeSend: true }))
        })
        .catch((error) => {
          history.push('/home')
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!(!data.errorEmail || data.errorEmail?.status)) {
      instance
        .post('/auth/code', {
          email: data.email,
        })
        .then(() => {
          dispatch(updateUser({ email: data.email, codeSend: true }))
        })
        .catch((error) => {
          setData({
            ...data,
            errorEmail: {
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
                setData({ ...data, email: e.target.value })
              }}
              onBlur={(e) => {
                const result = validate(
                  emailSchema.validate({
                    email: e.target.value,
                  })
                )

                setData({
                  ...data,
                  errorEmail: {
                    ...result,
                  },
                })
              }}
              className={data.errorEmail?.status ? 'error' : ''}
              placeholder="Email"
              type="email"
              value={data.email}
            />
            <label className={data.errorEmail?.status ? 'error' : ''}>
              {data.errorEmail?.message}
            </label>
          </div>
          <button className="button">Send</button>
        </form>
      </main>
    </>
  )
}

export default CreateCode
