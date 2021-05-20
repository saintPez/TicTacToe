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
import Rooms from './pages/Rooms/'
import CreateRoom from './pages/Room/Create/'

function App() {
  return (
    <Router>
      <Header user={true} />
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
        <Route path="/room/create">
          <CreateRoom />
        </Route>
        <Route path="/rooms">
          <Rooms />
        </Route>
      </Switch>
    </Router>
  )
}

export default App
