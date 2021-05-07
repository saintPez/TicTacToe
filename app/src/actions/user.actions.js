export const userActions = {
  SET: '@user/userSet',
  UPDATE: '@user/userUpdated',
  RESET: '@user/userReset',
}

export const setUser = (user) => ({
  type: userActions.SET,
  payload: user,
})

export const updateUser = (user) => ({
  type: userActions.UPDATE,
  payload: user,
})

export const resetUser = () => ({
  type: userActions.RESET,
})
