import { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'

import LoadingSpin from '../../components/LoadingSpin'

import instance from '../../axios'

function Play() {
  const history = useHistory()

  const [isLoading] = useState(true)
  const [, setRooms] = useState([])

  useEffect(() => {
    instance
      .get('/socket/', {
        config: { test: 'hola' },
      })
      .then((response) => {
        setRooms(response.data.rooms)
      })
      .catch((error) => {
        history.push('/')
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      {isLoading ? (
        <div className="main-item loading">
          <LoadingSpin />
        </div>
      ) : (
        <>
          <div className="main-item">
            <h1>Play</h1>
          </div>
        </>
      )}
    </>
  )
}

export default Play
