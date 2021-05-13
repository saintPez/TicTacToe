import { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useCookies } from 'react-cookie'
import { useDispatch, useSelector } from 'react-redux'

import Joi from 'joi'

import { updateUser } from '../../actions/user.actions'
import instance from '../../axios'
import validate from '../../utils/validate'

import './styles.css'

const nameSchema = Joi.object({
  name: Joi.string().min(3).required(),
})

const emailSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
})

const passwordSchema = Joi.object({
  password: Joi.string().min(5).required(),
})

function SignUp() {
  const [, setCookie] = useCookies([])
  const user = useSelector((state) => state.user)
  const history = useHistory()
  const dispatch = useDispatch()
  const [data, setData] = useState({ name: '', email: '', password: '' })

  useEffect(() => {
    if (user.account) history.push('/home')
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (
      !(
        !data.errorName ||
        data.errorName?.status ||
        !data.errorEmail ||
        data.errorEmail?.status ||
        !data.errorPassword ||
        data.errorPassword?.status
      )
    ) {
      instance
        .post('/auth/signUp', {
          name: data.name,
          email: data.email,
          password: data.password,
        })
        .then((response) => {
          const now = new Date()
          setCookie('Authorization', response.data.access_token, {
            path: '/',
            expires: new Date(now.getTime() + response.data.expires_in * 1000),
          })
          setCookie('refresh_token', response.data.refresh_token, {
            path: '/',
            expires: new Date(
              now.getTime() + response.data.refresh_token_expires_in * 1000
            ),
          })
          dispatch(
            updateUser({
              access_token: response.data.access_token,
              refresh_token: response.data.refresh_token,
            })
          )
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
          <h1>Sign Up</h1>
          <div className="input">
            <input
              onChange={(e) => {
                setData({ ...data, name: e.target.value })
              }}
              onBlur={(e) => {
                const result = validate(
                  nameSchema.validate({
                    name: e.target.value,
                  })
                )
                setData({
                  ...data,
                  errorName: {
                    ...result,
                  },
                })
              }}
              className={data.errorName?.status ? 'error' : ''}
              placeholder="Name"
              type="text"
              value={data.name}
            />
            <label className={data.errorName?.status ? 'error' : ''}>
              {data.errorName?.message}
            </label>
          </div>
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
              type="Password"
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

export default SignUp
