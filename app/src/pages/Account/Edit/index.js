import { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useCookies } from 'react-cookie'

import Joi from 'joi'

import instance from '../../../axios'
import validate from '../../../utils/validate'

import Modal from '../../../components/Modal/'

import './styles.css'

const usernameSchema = Joi.object({
  username: Joi.string().min(3).max(22).required(),
})

const nameSchema = Joi.object({
  name: Joi.string().min(3).max(22).required(),
})

const emailSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
})

const passwordSchema = Joi.object({
  password: Joi.string().min(5).required(),
})

function AccountEdit() {
  const user = useSelector((state) => state.user)
  const history = useHistory()
  const [, setCookie] = useCookies()
  const [show, setShow] = useState(false)
  const [data, setData] = useState({
    username: user?.username || '',
    name: user?.name || '',
    email: user?.email || '',
    password: '',
  })

  useEffect(() => {
    if (user.room) history.push('/leave')
    if (!user.account) history.push('/home')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (
      (data.username !== (user?.username || '') ||
        data.name !== user.name ||
        data.email !== user.email) &&
      !(
        data.errorUsername?.status ||
        data.errorName?.status ||
        data.errorEmail?.status
      )
    ) {
      setShow(true)
    }
  }

  const handleCancel = () => {
    setShow(false)
    setData({ ...data, password: '' })
  }

  const handleAccept = () => {
    if (!(!data.errorPassword || data.errorPassword?.status)) {
      setShow(false)
      instance
        .put(`/user/${user._id}`, {
          username: data.username,
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
          setData({
            ...data,
            error: '',
          })
        })
        .catch((error) => {
          setData({
            ...data,
            error: error.response?.data.message,
          })
        })
    }
    setData({ ...data, password: '' })
  }

  return (
    <>
      <div className="main-item account-edit">
        <div className="account-edit-error">{data.error}</div>
        <form onSubmit={handleSubmit}>
          <span className="account-input-info">Username</span>
          <div className="input">
            <input
              onChange={(e) => {
                setData({ ...data, username: e.target.value })
              }}
              onBlur={(e) => {
                const result = validate(
                  usernameSchema.validate({
                    username: e.target.value,
                  })
                )

                setData({
                  ...data,
                  errorUsername: {
                    ...result,
                  },
                })
              }}
              className={data.errorUsername?.status ? 'error' : ''}
              placeholder="Username"
              type="text"
              value={data.username}
            />
            <label className={data.errorUsername?.status ? 'error' : ''}>
              {data.errorUsername?.message}
            </label>
          </div>
          <span className="account-input-info">Name</span>
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
          <span className="account-input-info">Email</span>
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
              type="text"
              value={data.email}
            />
            <label className={data.errorEmail?.status ? 'error' : ''}>
              {data.errorEmail?.message}
            </label>
          </div>
          <button className="button">Save</button>
        </form>
      </div>
      <Modal
        show={show}
        onCancel={handleCancel}
        onAccept={handleAccept}
        title="Confirm password"
        body={
          <>
            <span className="account-input-info">Password</span>
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
                type="password"
                value={data.password}
              />
              <label className={data.errorPassword?.status ? 'error' : ''}>
                {data.errorPassword?.message}
              </label>
            </div>
          </>
        }
      />
    </>
  )
}

export default AccountEdit
