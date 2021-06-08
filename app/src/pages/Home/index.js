import { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'

import './styles.css'

function Home() {
  const history = useHistory()
  const user = useSelector((state) => state.user)

  useEffect(() => {
    if (user.room) history.push('/leave')
    if (user.queue) history.push('/leave-queue')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <div className="main-item">
        <h1>News</h1>
        <p>
          TicTacToe is a game application, inspired by tic-tac-toe online. It
          allows you to share with friends. Create personalized games, where you
          can play alone and play online. TicTacToe also allows you to chat with
          your friends while you play, this chat is global. So you can interact
          with your friends and other people within the platform.
        </p>
        <br />
        <p>
          In TicTacToe's privacy policy, we promise to protect our users'
          information. In addition all the information we collect whether it is
          name, email and other aspects related to the history of each game
          played or aspects of the game. They are used to improve our services
          and we do not use them for profit.
        </p>
        <br />
        <p>
          Our terms of use highlight the following points for each user user
          <ol className="m-p">
            <li>
              If you are part of TicTacToe, you must respect the members of the
              community. the community.
            </li>
            <li>
              If you speak from the chat, you must be respectful of other
              members.
            </li>
          </ol>
        </p>
      </div>
    </>
  )
}

export default Home
