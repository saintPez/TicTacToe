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
import CreateRoom from './pages/Room/Create/'
import Leave from './pages/Leave'
import PlayOnlineGame from './pages/PlayOnlineGame'

import TicTacToe from './components/TicTacToe'
import Account from './components/Account'
import Chat from './components/Chat'

function App() {
  return (
    <Router>
      <Header />
      <Switch>
        <Redirect exact from="/" to="/home" />
        <Route path="/signIn">
          <SignIn />
        </Route>
        <Route path="/signUp">
          <SignUp />
        </Route>
        <Route path="/forgot-password">
          <ForgotPassword />
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
                <Route path="/room/create">
                  <CreateRoom />
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
