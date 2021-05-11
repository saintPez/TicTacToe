import { useState } from 'react'

import axios from 'axios'

import Joi from 'joi'

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
  const [data, setData] = useState({ name: '', email: '', password: '' })

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
      console.log('ok')
      try {
        const { data: json } = await axios.post(
          'http://localhost:3001/api/auth/signUp',
          {
            name: data.name,
            email: data.email,
            password: data.password,
          }
        )
        console.log(json)
      } catch (error) {
        console.log('error')
      }
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
