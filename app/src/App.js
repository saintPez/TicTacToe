import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom'

import Header from './components/Header'

import Home from './pages/Home/'
import SignIn from './pages/SignIn/'
import SignUp from './pages/SignUp/'
import ForgotPassword from './pages/ForgotPassword/'
import User from './pages/User/'
import Play from './pages/Play/'
import Rooms from './pages/Rooms/'
import Room from './pages/Room/'
import Leave from './pages/Leave'
import PlayOnlineGame from './pages/PlayOnlineGame/'
import Game from './pages/Game/'
import Games from './pages/Games/'
import PlayOffline from './pages/PlayOffline/'
import AccountEdit from './pages/Account/Edit/'
import AccountPassword from './pages/Account/Password/'

import TicTacToe from './components/TicTacToe'
import Account from './components/Account'
import Chat from './components/Chat'
import AccountOptions from './components/AccountOptions'

function App() {
  return (
    <Router>
      <Header />
      <Switch>
        <Redirect exact from="/" to="/home" />
        <Redirect exact from="/settings" to="/settings/edit" />
        <Route path="/signIn">
          <SignIn />
        </Route>
        <Route path="/signUp">
          <SignUp />
        </Route>
        <Route path="/forgot-password">
          <ForgotPassword />
        </Route>

        <Redirect exact from="/account" to="/account/edit" />
        <Route path="/account">
          <main className="main">
            <div className="main-column-left">
              <AccountOptions />
            </div>
            <div className="main-column-center">
              <Route path="/account/edit">
                <AccountEdit />
              </Route>
              <Route path="/account/password">
                <AccountPassword />
              </Route>
            </div>
            <div className="main-column-right">
              <Account />
              <Chat />
            </div>
          </main>
          {/* <AcceptCredentials /> */}
        </Route>

        {/* <Route path="/play">
          <main className="main">
            <div className="main-column-left">
              <TicTacToe />
            </div>
            <div className="main-column-center-right">
              <Play />
            </div>
          </main>
        </Route> */}

        <Route>
          <main className="main">
            <div className="main-column-left">
              <TicTacToe />
            </div>
            <Route>
              <div className="main-column-center">
                <Route path="/home">
                  <Home />
                </Route>
                <Route path="/user/:id">
                  <User />
                </Route>
                <Route exact path="/play">
                  <Play />
                </Route>
                <Route path="/play/online/:id">
                  <PlayOnlineGame />
                </Route>
                <Route path="/rooms">
                  <Rooms />
                </Route>
                <Route path="/room/:id">
                  <Room />
                </Route>
                <Route path="/leave">
                  <Leave />
                </Route>
                <Route path="/game/:id">
                  <Game />
                </Route>
                <Route path="/games">
                  <Games />
                </Route>
                <Route path="/play/offline">
                  <PlayOffline />
                </Route>
              </div>
              <div className="main-column-right">
                <Account />
                <Chat />
              </div>
            </Route>
          </main>
        </Route>
      </Switch>
    </Router>
  )
}

export default App
