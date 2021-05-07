import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

import './styles.css'

import { createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'

import userReducer from './reducers/user.reducer'

const store = createStore(combineReducers({ user: userReducer }))

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>,
  document.getElementById('root')
)
