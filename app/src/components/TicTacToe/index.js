import { Link } from 'react-router-dom'

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
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam ut
          auctor magna. Suspendisse metus justo, hendrerit in semper non,
          iaculis ac leo. Vivamus molestie sem aliquam magna pharetra tempus.
          Mauris diam nisi, convallis et dignissim nec, mollis nec nisl. Aliquam
          ac interdum erat, quis tincidunt magna. Suspendisse porttitor velit a
          hendrerit sodales. Integer sollicitudin accumsan ante a iaculis. Sed
          elementum velit malesuada neque pellentesque, eget porta nunc
          hendrerit. Donec at arcu tincidunt, tempor sem ac, lacinia ante. Proin
          in arcu in nisi condimentum posuere. Nulla tincidunt scelerisque mi
          non aliquam. Donec accumsan tristique sapien, in ultricies massa
          faucibus ac.
        </p>
      </div>
    </>
  )
}

export default TicTacToe
