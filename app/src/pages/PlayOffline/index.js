import { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'

import CreateTable from '../../components/CreateTable'
import PlayOfflineGame from '../../components/PlayOfflineGame'
import SelectComponent from '../../components/Models/Select'

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
    if (user.queue) history.push('/leave-queue')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      {config.created ? (
        <PlayOfflineGame config={config} />
      ) : (
        <div className="main-item">
          <div className="rooms-create">
            <CreateTable config={config} setConfig={setConfig} />
            <div className="options-tools">
              <h1 className="numberX">{`${config.width}x${config.height}`}</h1>
              <SelectComponent
                text="Consecutive"
                options={[3, 4, 5, 6]}
                className="display-select"
                chooseOption={(e) => {
                  setConfig({
                    ...config,
                    consecutive: parseInt(e.target.textContent),
                  })
                  //console.log(config.consecutive)
                }}
              />
              <SelectComponent
                text="Players"
                options={[2, 3, 4]}
                className="display-select"
                chooseOption={(e) => {
                  setConfig({
                    ...config,
                    players: parseInt(e.target.textContent),
                  })
                  //console.log(config.players)
                }}
              />
              <span className="label-div p">Inverted</span>
              <label className="switch">
                <input
                  type="checkbox"
                  onChange={() => {
                    setConfig({ ...config, inverted: !config.inverted })
                  }}
                />
                <span className="slider round"></span>
              </label>
              <button
                onClick={() => {
                  setConfig({ ...config, created: true })
                }}
                onMouseOver={() => console.log(config.players)}
                className="create-room-btn"
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
