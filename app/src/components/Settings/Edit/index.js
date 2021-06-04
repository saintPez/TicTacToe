import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useCookies } from 'react-cookie'
import Joi from 'joi'

import './styles.css'

import instance from '../../../axios'
import validate from '../../../utils/validate'
import { updateUser } from '../../../actions/user.actions'
import { resetUser } from '../../../actions/user.actions'

function EditComponent() {
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const [, setCookie] = useCookies([])

  const nameSchema = Joi.object({
    name: Joi.string().min(3).required(),
  })

  const emailSchema = Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required(),
  })

  const usernameSchema = Joi.object({
    username: Joi.string().min(3).required(),
  })

  const [data, setData] = useState({
    name: '',
    email: '',
    username: '',
  })

  const handleOnChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    })
  }

  const handleSendForm = async (e) => {
    e.preventDefault()

    if (
      !(
        !data.errorEmail ||
        !data.errorEmail?.status ||
        !data.errorName ||
        !data.errorName?.status ||
        !data.errorUsername ||
        !data.errorUsername?.status
      )
    ) {
    } else {
      document.querySelector('.modal').classList.remove('hide')
      document.querySelector('.modal').classList.add('show')

      instance
        .post('/user/update/', {
          name: data.name,
          email: data.email,
          username: data.password,
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
            resetUser(),
            updateUser({
              access_token: response.data.access_token,
              refresh_token: response.data.refresh_token,
            })
          )
        })
        .catch((error) => {
          console.log(error.response)
          setData({
            ...data,
            errorEmail: {
              status: true,
              message: error.response?.data.message,
            },
            errorName: {
              status: true,
              message: error.response?.data.message,
            },
            errorUsername: {
              status: true,
              message: error.response?.data.message,
            },
          })
        })
    }
  }

  return (
    <div className="main-edit">
      <div className="edit-user">
        <form className="form-edit" onSubmit={handleSendForm}>
          <div className="container-text">
            <span className="name-fill">Nombre:</span>
            <input
              type="text"
              name="name"
              className={
                data.errorName?.status
                  ? 'container-input error'
                  : 'container-input'
              }
              placeholder="Nombre"
              defaultValue={user.name}
              onChange={handleOnChange}
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
            />
            <span className={data.errorName?.status ? 'error' : ''}>
              {data.errorName?.message}
            </span>
          </div>
          <div className="container-text">
            <span className="name-fill">Correo electrónico:</span>
            <input
              type="email"
              name="email"
              className={
                data.errorEmail?.status
                  ? 'container-input error'
                  : 'container-input'
              }
              placeholder="Correo electrónico"
              defaultValue={user.email}
              onChange={handleOnChange}
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
            />
            <span className={data.errorEmail?.status ? 'error' : ''}>
              {data.errorEmail?.message}
            </span>
          </div>
          <div className="container-text">
            <span className="name-fill">Nombre de usuario:</span>
            <input
              type="text"
              name="username"
              className={
                data.errorUsername?.status
                  ? 'container-input error'
                  : 'container-input'
              }
              placeholder="Nombre de usuario"
              defaultValue={user.username}
              onChange={handleOnChange}
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
            />
            <span className={data.errorUsername?.status ? 'error' : ''}>
              {data.errorUsername?.message}
            </span>
          </div>
          <button className="btn-save" type="submit">
            Guardar
          </button>
        </form>
      </div>
    </div>
  )
}

export default EditComponent
