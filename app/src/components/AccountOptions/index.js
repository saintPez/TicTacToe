import { Link } from 'react-router-dom'

import './styles.css'

function AccountOptions() {
  return (
    <>
      <div className="main-item">
        <div className="account-options">
          <Link className="account-options-item" to="/account/edit">
            Edit account
          </Link>
          <Link className="account-options-item" to="/account/password">
            Edit password
          </Link>
        </div>
      </div>
    </>
  )
}

export default AccountOptions
