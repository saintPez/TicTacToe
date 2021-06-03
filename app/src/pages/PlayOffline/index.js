import { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'

import CreateTable from '../../components/CreateTable'
import PlayOfflineGame from '../../components/PlayOfflineGame'

function PlayOffline() {
  const history = useHistory()
  const user = useSelector((state) => state.user)
  const [config, setConfig] = useState({
    width: 10,
    height: 10,
    consecutive: 5,
    players: 2,
    inverted: false,
    created: false,
  })

  useEffect(() => {
    if (user.room) history.push('/leave')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      {config.created ? (
        <PlayOfflineGame config={config} />
      ) : (
        <div className="main-item">
          <div className="board-create">
            <CreateTable config={config} setConfig={setConfig} />
            <div>
              <h1>{`${config.width}x${config.height}`}</h1>
              <div>Consecutive</div>
              <select
                name="consecutive"
                value={config.consecutive}
                onChange={(e) => {
                  setConfig({
                    ...config,
                    consecutive: parseInt(e.target.value),
                  })
                }}
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
              </select>
              <div>Players</div>
              <select
                name="consecutive"
                value={config.players}
                onChange={(e) => {
                  setConfig({ ...config, players: parseInt(e.target.value) })
                }}
              >
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
              <div>Inverted</div>
              <input
                type="checkbox"
                checked={config.inverted}
                onChange={() => {
                  setConfig({ ...config, inverted: !config.inverted })
                }}
              />
              <button
                onClick={() => {
                  setConfig({ ...config, created: true })
                }}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default PlayOffline
