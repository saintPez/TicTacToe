import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Joi from 'joi'

import { updateUser } from '../../actions/user.actions'
import instance from '../../axios'
import validate from '../../utils/validate'

import './styles.css'

const codeSchema = Joi.object({
  code: Joi.string().min(6).required(),
})

function ValidCode() {
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const [data, setData] = useState({ code: '' })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!(!data.errorCode || data.errorCode?.status)) {
      instance
        .get(`/auth/code/${user.email}/${data.code}`)
        .then(() => {
          dispatch(updateUser({ code: data.code }))
        })
        .catch((error) => {
          console.log(error.response)
          setData({
            ...data,
            errorCode: {
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
                setData({ ...data, code: e.target.value })
              }}
              onBlur={(e) => {
                const result = validate(
                  codeSchema.validate({
                    code: e.target.value,
                  })
                )

                setData({
                  ...data,
                  errorCode: {
                    ...result,
                  },
                })
              }}
              className={data.errorCode?.status ? 'error' : ''}
              placeholder="Code"
              type="text"
              value={data.code}
            />
            <label className={data.errorCode?.status ? 'error' : ''}>
              {data.errorCode?.message}
            </label>
          </div>
          <button className="button">Send</button>
        </form>
      </main>
    </>
  )
}

export default ValidCode
