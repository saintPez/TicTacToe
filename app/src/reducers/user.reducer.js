import { userActions } from '../actions/user.actions'

const initialState = {
  account: false,
}

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case userActions.SET:
      return { ...action.payload, account: true }
    case userActions.UPDATE:
      return { ...state, ...action.payload }
    case userActions.RESET:
      return initialState
    default:
      return state
  }
}

export default userReducer
