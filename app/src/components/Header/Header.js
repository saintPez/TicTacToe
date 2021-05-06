import { Link } from 'react-router-dom'

import { HashtagIcon } from '@heroicons/react/solid'
import { BookOpenIcon, UserIcon, UserAddIcon } from '@heroicons/react/outline'

import './Header.css'

function Header({ user }) {
  return (
    <header>
      {user ? (
        <>
          <a href="#user" className="item left">
            <span className="icon avatar">S</span>
            <span className="text">Santiago Lopez (200)</span>
          </a>
          <a href="#user" className="item">
            <HashtagIcon className="icon" />
            <span className="text">Play</span>
          </a>
          <a href="#user" className="item right">
            <BookOpenIcon className="icon" />
            <span className="text">Games</span>
          </a>
        </>
      ) : (
        <>
          <Link to="/signIn" className="item left">
            <UserIcon className="icon" />
            <span className="text">Sign In</span>
          </Link>
          <Link to="/signUp" className="item right">
            <UserAddIcon className="icon" />
            <span className="text">Sign Up</span>
          </Link>
        </>
      )}
    </header>
  )
}

export default Header
