import { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'

import RoomsComponent from '../../components/Rooms'
import CreateTable from '../../components/CreateTable'
//import SnackbarModel from '../../components/Models/Snackbar'
import SelectComponent from '../../components/Models/Select'

import instance from '../../axios'

import './styles.css'

function Rooms() {
  const history = useHistory()
  const user = useSelector((state) => state.user)
  const [config, setConfig] = useState({
    width: 10,
    height: 10,
    consecutive: 5,
    players: 2,
    inverted: false,
  })

  useEffect(() => {
    if (!user.socket) history.push('/home')
    if (user.room) history.push('/leave')
    if (user.queue) history.push('/leave-queue')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handlerClick = () => {
    instance
      .post(`/socket/?socket=${user.socketId}`, {
        config: {
          ...config,
        },
      })
      .then((response) => {
        history.push(`/room/${response.data.room.id}`)
      })
      .catch((error) => {
        history.push('/')
      })
  }

  return (
    <>
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
              onClick={handlerClick}
              className="create-room-btn"
              onMouseOver={() => console.log(config.players)}
            >
              Create
            </button>
          </div>
        </div>
      </div>
      <RoomsComponent />
    </>
  )
}

export default Rooms
