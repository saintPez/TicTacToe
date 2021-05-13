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

function App() {
  return (
    <Router>
      <Header />
      <Switch>
        <Redirect exact from="/" to="/home" />
        <Route path="/home">
          <Home />
        </Route>
        <Route path="/signIn">
          <SignIn />
        </Route>
        <Route path="/signUp">
          <SignUp />
        </Route>
        <Route path="/forgot-password">
          <ForgotPassword />
        </Route>
      </Switch>
    </Router>
  )
}

export default App
