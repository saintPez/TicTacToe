import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

import './styles.css'

function Account() {
  const user = useSelector((state) => state.user)
  return (
    <>
      {user.account ? (
        <div className="main-item main-account">
          <span className="main-account-avatar">
            {(user.username || user.name)?.charAt(0)}
          </span>
          <div className="main-account-info">
            <div className="main-account-info-name">{user.name}</div>
            <Link to="/account">Account</Link>
            <br />
            <Link to="/logOut">Log out</Link>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  )
}

export default Account
