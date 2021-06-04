import { Link } from 'react-router-dom'
import './styles.css'

function MenuSettingsComponent() {
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
