import { useState } from 'react'
import { useSelector } from 'react-redux'

import './styles.css'

function AcceptCredentials() {
  const user = useSelector((state) => state.user)

  const [data, setData] = useState({
    passwordCredentials: '',
  })

  const handleInputChange = async (e) => {
    setData({
      [e.target.name]: e.target.value,
    })
  }

  const handleSuccess = () => {
    document.querySelector('div.modal[type=modal]').classList.remove('show')
    document.querySelector('div.modal[type=modal]').classList.add('hide')

    console.log(true)
  }

  const handleSendCredentials = async (e) => {
    e.preventDefault()
    !data.passwordCredentials
      ? console.log('Error')
      : data.passwordCredentials === user.password
      ? handleSuccess()
      : console.log(false)
  }

  const handleResetForm = () => {
    document.querySelector('div.modal[type=modal]').classList.remove('show')
    document.querySelector('div.modal[type=modal]').classList.add('hide')
  }

  const handleHideModal = async (e) => {
    if (e.target.getAttribute('type') === 'modal') {
      document.querySelector('div.modal[type=modal]').classList.remove('show')
      document.querySelector('div.modal[type=modal]').classList.add('hide')
    }
  }

  return (
    <div className="modal hide" type="modal" onClick={handleHideModal}>
      <div className="modal-container">
        <div className="modal-title">Verificación de credenciales</div>
        <div className="modal-content">
          <span className="span-credentials">
            Por favor antes de guardar, debe ingresar su contraseña
          </span>
          <form className="form-credentials" onSubmit={handleSendCredentials}>
            <input
              type="password"
              name="passwordCredentials"
              placeholder="Contraseña"
              onChange={handleInputChange}
            />

            <button className="btn-send" type="submit">
              Continuar
            </button>
            <button
              className="btn-cancel"
              type="reset"
              onClick={handleResetForm}
            >
              Cancelar
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AcceptCredentials
