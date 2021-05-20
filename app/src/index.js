import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

import './styles.css'

import { CookiesProvider } from 'react-cookie'

import { createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'

import userReducer from './reducers/user.reducer'

const store = createStore(combineReducers({ user: userReducer }))

ReactDOM.render(
  <CookiesProvider>
    <Provider store={store}>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </Provider>
  </CookiesProvider>,
  document.getElementById('root')
)
