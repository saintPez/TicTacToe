import { useEffect, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'

import instance from '../../axios'

function User() {
  const history = useHistory()
  const { id } = useParams()
  const [user, setUser] = useState({})

  useEffect(() => {
    instance
      .get(`/user/${id}`)
      .then((response) => {
        console.log(response)
        setUser({ ...response.data.user })
      })
      .catch((error) => {
        history.push('/')
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <div className="main-item">
        <h1>{user.name}</h1>
      </div>
    </>
  )
}

export default User
