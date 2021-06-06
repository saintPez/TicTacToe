import { Link } from 'react-router-dom'

import { DateTime } from 'luxon'

import { HashtagIcon } from '@heroicons/react/solid'

import './styles.css'

function TicTacToe() {
  return (
    <>
      <div className="main-item">
        <Link to="/home" className="main-tictactoe">
          <h1>
            <HashtagIcon className="main-tictactoe-icon" />
            <span>Tic Tac Toe</span>
          </h1>
        </Link>
        <p>
          TicTacToe is a simple open source game application, created to develop
          brain areas such as the ability to develop strategies and logical
          thinking.
        </p>
        <center>
          <a href="https://github.com/saintPez/TicTacToe/graphs/contributors">
            Copyright © {`${DateTime.now().year}`}
          </a>
        </center>
      </div>
    </>
  )
}

export default TicTacToe
