import './styles.css'

function SignUp() {
  return (
    <>
      <main>
        <form>
          <h1>Sign Up</h1>
          <div className="input">
            <input className="" placeholder="Name" type="text" />
            <label className="">Error</label>
          </div>
          <div className="input">
            <input className="" placeholder="Email" type="email" />
            <label className="">Error</label>
          </div>
          <div className="input">
            <input className="" placeholder="Password" type="Password" />
            <label className="">Error</label>
          </div>
          <button className="button">Send</button>
        </form>
      </main>
    </>
  )
}

export default SignUp
