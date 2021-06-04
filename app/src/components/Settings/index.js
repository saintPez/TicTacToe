import { Link, useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import './styles.css'

function MenuSettingsComponent() {
  const user = useSelector((state) => user.state)
  const history = useHistory()

  if (user.account) {
  } else {
    history.push('/')
  }

  return (
    <div className="main-settings">
      <ul>
        <Link to="/settings/edit">
          <li>Editar información</li>
        </Link>
        <Link to="/settings/password">
          <li>Cambiar contraseña</li>
        </Link>
        <Link to="/settings/game">
          <li>Configuración juego</li>
        </Link>
      </ul>
    </div>
  )
}

export default MenuSettingsComponent
