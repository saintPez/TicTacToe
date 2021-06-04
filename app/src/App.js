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

import TicTacToe from './components/TicTacToe'
import Account from './components/Account'
import Chat from './components/Chat'
import MenuSettingsComponent from './components/Settings'
import EditComponent from './components/Settings/Edit'
import PasswordComponent from './components/Settings/Password'
import AcceptCredentials from './components/Modals/AcceptCredentials'

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
        <Route path="/settings">
          <main className="main main-s">
            <div className="main-column-left">
              <MenuSettingsComponent />
            </div>
            <div className="main-column-center">
              <Route path="/settings/edit">
                <EditComponent />
              </Route>
              <Route path="/settings/password">
                <PasswordComponent />
              </Route>
            </div>
            <div className="main-column-right">
              <Account />
            </div>
          </main>
          <AcceptCredentials />
        </Route>

        <Route>
          <main className="main">
            <div className="main-column-left">
              <TicTacToe />
            </div>
            <div className="main-column-center">
              <Route path="/home">
                <Home />
              </Route>
              <Route path="/user/:id">
                <User />
              </Route>
            </div>
            <div className="main-column-right">
              <Account />
              <Chat />
            </div>
          </main>
        </Route>
      </Switch>
    </Router>
  )
}

export default App
