import { Link } from 'react-router-dom'

import './styles.css'

function SignIn() {
  return (
    <>
      <main>
        <form>
          <h1>Sign In</h1>
          <div className="input">
            <input className="" placeholder="Email" type="email" />
            <label className="">Error</label>
          </div>
          <div className="input">
            <input className="" placeholder="Password" type="Password" />
            <label className="">Error</label>
          </div>
          <button className="button">Send</button>
          <Link to="/forgot-password" className="forgot">
            Forgot password?
          </Link>
        </form>
      </main>
    </>
  )
}

export default SignIn
