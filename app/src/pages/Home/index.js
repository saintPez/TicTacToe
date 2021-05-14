import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import './styles.css'

function Home() {
  const user = useSelector((state) => state.user)
  return (
    <>
      <main className="home">
        <div className="home-column-one">
          <div className="home-item">
            <h1>Home</h1>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam ut
              auctor magna. Suspendisse metus justo, hendrerit in semper non,
              iaculis ac leo. Vivamus molestie sem aliquam magna pharetra
              tempus. Mauris diam nisi, convallis et dignissim nec, mollis nec
              nisl. Aliquam ac interdum erat, quis tincidunt magna. Suspendisse
              porttitor velit a hendrerit sodales. Integer sollicitudin accumsan
              ante a iaculis. Sed elementum velit malesuada neque pellentesque,
              eget porta nunc hendrerit. Donec at arcu tincidunt, tempor sem ac,
              lacinia ante. Proin in arcu in nisi condimentum posuere. Nulla
              tincidunt scelerisque mi non aliquam. Donec accumsan tristique
              sapien, in ultricies massa faucibus ac.
            </p>
          </div>
        </div>
        <div className="home-column-two">
          <div className="home-item home-user">
            <span className="home-avatar">
              {(user.username || user.name)?.charAt(0)}
            </span>
            <div className="home-user-info">
              <div className="home-name">{user.username || user.name}</div>
              <Link to="/account">Account</Link>
              <br />
              <Link to="/settings">Settings</Link>
            </div>
          </div>
          <div className="home-item home-chat">
            <h1>Chat</h1>
            <ol className="home-chat-messages">
              <li className="chat">
                <div className="me">
                  <div className="chat-title">Santiago</div>
                  <div className="chat-message">hola</div>
                </div>
              </li>
              <li className="chat">
                <div className="you">
                  <div className="chat-title">Gomes</div>
                  <div className="chat-message">hi</div>
                </div>
              </li>
            </ol>
            <form
              className="home-chat-form"
              onSubmit={(e) => {
                e.preventDefault()
                console.log('se')
              }}
            >
              <input />
              <button className="home-chat-send">{'>'}</button>
            </form>
          </div>
        </div>
      </main>
    </>
  )
}

export default Home
