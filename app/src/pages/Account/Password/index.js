import { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useCookies } from 'react-cookie'

import Joi from 'joi'

import instance from '../../../axios'
import validate from '../../../utils/validate'

import Modal from '../../../components/Modal/'

import './styles.css'

const passwordSchema = Joi.object({
  password: Joi.string().min(5).required(),
})

const confirmPasswordSchema = Joi.object({
  confirmPassword: Joi.string().min(5).required(),
})

function AccountPassword() {
  const user = useSelector((state) => state.user)
  const history = useHistory()
  const [, setCookie] = useCookies()
  const [show, setShow] = useState(false)
  const [data, setData] = useState({
    password: '',
    confirmPassword: '',
  })

  useEffect(() => {
    if (!user.account) history.push('/home')
    if (user.room) history.push('/leave')
    if (user.queue) history.push('/leave-queue')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!(!data.errorPassword || data.errorPassword?.status)) {
      setShow(true)
    }
  }

  const handleCancel = () => {
    setShow(false)
    setData({ ...data, password: '', confirmPassword: '' })
  }

  const handleAccept = () => {
    if (!(!data.errorConfirmPassword || data.errorConfirmPassword?.status)) {
      setShow(false)
      instance
        .put(`/user/${user._id}`, {
          newPassword: data.password,
          password: data.confirmPassword,
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
    setData({ ...data, confirmPassword: '' })
  }

  return (
    <>
      <div className="main-item account-password">
        <div className="account-password-error">{data.error}</div>
        <form onSubmit={handleSubmit}>
          <span className="account-password-input-info">New password</span>
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
              placeholder="New password"
              type="password"
              value={data.password}
            />
            <label className={data.errorPassword?.status ? 'error' : ''}>
              {data.errorPassword?.message}
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
            <span className="account-password-input-info">Password</span>
            <div className="input">
              <input
                onChange={(e) => {
                  setData({ ...data, confirmPassword: e.target.value })
                }}
                onBlur={(e) => {
                  const result = validate(
                    confirmPasswordSchema.validate({
                      confirmPassword: e.target.value,
                    })
                  )

                  setData({
                    ...data,
                    errorConfirmPassword: {
                      ...result,
                    },
                  })
                }}
                className={data.errorConfirmPassword?.status ? 'error' : ''}
                placeholder="Password"
                type="password"
                value={data.confirmPassword}
              />
              <label
                className={data.errorConfirmPassword?.status ? 'error' : ''}
              >
                {data.errorConfirmPassword?.message}
              </label>
            </div>
          </>
        }
      />
    </>
  )
}

export default AccountPassword
