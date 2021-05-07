import { useState } from 'react'
import { Link } from 'react-router-dom'

import Joi from 'joi'

/*
import Joi from 'joi'

export const signInSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(5).required(),
})

export const signUpSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(5).required(),
})

export const createCodeSchema = Joi.object({
  email: Joi.string().email().required(),
})

export const isValidCodeSchema = Joi.object({
  code: Joi.string().min(6).max(6).required(),
})

export const resetPasswordSchema = Joi.object({
  password: Joi.string().min(5).required(),
})

*/

import './styles.css'

const emailSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
})

const passwordSchema = Joi.object({
  password: Joi.string().min(5).required(),
})

const formatMessage = (text) => {
  const message = text.replace(/"/g, '')
  return message.charAt(0).toUpperCase() + message.slice(1)
}

function SignIn() {
  const [data, setData] = useState({})

  const handleSubmit = (e) => {
    e.preventDefault()
    if (
      !(
        !data.errorEmail ||
        data.errorEmail?.status ||
        !data.errorPassword ||
        data.errorPassword?.status
      )
    ) {
      console.log('ok')
    }
  }

  return (
    <>
      <main>
        <form onSubmit={handleSubmit}>
          <h1>Sign In</h1>
          <div className="input">
            <input
              onChange={(e) => {
                setData({ ...data, email: e.target.value })
              }}
              onBlur={(e) => {
                const result = emailSchema.validate({
                  email: e.target.value,
                })
                if (result.error) {
                  const message = formatMessage(result.error.details[0].message)

                  setData({
                    ...data,
                    errorEmail: {
                      status: true,
                      message,
                    },
                  })
                } else {
                  setData({
                    ...data,
                    errorEmail: {
                      status: false,
                    },
                  })
                }
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
                const result = passwordSchema.validate({
                  password: e.target.value,
                })
                if (result.error) {
                  const message = formatMessage(result.error.details[0].message)

                  setData({
                    ...data,
                    errorPassword: {
                      status: true,
                      message,
                    },
                  })
                } else {
                  setData({
                    ...data,
                    errorPassword: {
                      status: false,
                    },
                  })
                }
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
          <Link to="/forgot-password" className="forgot">
            Forgot password?
          </Link>
        </form>
      </main>
    </>
  )
}

export default SignIn
