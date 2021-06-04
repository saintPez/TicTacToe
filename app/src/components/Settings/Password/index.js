import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import './styles.css'
import Joi from 'joi'

import validate from '../../../utils/validate'

function PasswordComponent() {
  const user = useSelector((state) => state.user)

  const [data, setData] = useState({
    password: '',
  })

  const passwordSchema = Joi.object({
    password: Joi.string().min(5).required(),
  })

  const handleOnChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    })
  }

  const handleSendData = async (e) => {
    e.preventDefault()

    let passwordUI = document.querySelector('input[name=password]')

    if (data.p) console.log(data.password || passwordUI.value)
  }
  return (
    <div className="main-password">
      <form className="form-password" onSubmit={handleSendData}>
        <div className="container-text">
          <span className="name-fill">Contraseña</span>
          <input
            type="password"
            name="password"
            className={
              data.errorPassword?.status
                ? 'container-input error'
                : 'container-input'
            }
            placeholder="Contraseña"
            defaultValue={user.password || '1234567890Dd'}
            onChange={handleOnChange}
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
          />
          <span className={data.errorPassword?.status ? 'error' : ''}>
            {data.errorPassword?.message}
          </span>
        </div>
        <button className="btn-save" type="submit">
          Guardar
        </button>
      </form>
    </div>
  )
}

export default PasswordComponent
