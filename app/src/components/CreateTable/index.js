import { useState, useEffect } from 'react'

import CreateTableItem from '../CreateTableItem'

import './styles.css'

function CreateTable({ config, setConfig }) {
  const [active, setActive] = useState({})

  useEffect(() => {
    handlerClick(config.width, config.height)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handlerClick = (width, height) => {
    let newState = {}
    for (let i = 0; i < width; i++) {
      for (let a = 0; a < height; a++) {
        newState[`${i + 1}x${a + 1}`] = true
      }
    }
    setActive({ ...newState })
    setConfig({ ...config, width, height })
  }

  const table = []
  for (let i = 0; i < 11; i++) {
    for (let a = 0; a < 11; a++) {
      if (i === 0 || a === 0) {
        if (a === 0) {
          if (i === 0) table.push(<div>{` `}</div>)
          else table.push(<div>{i}</div>)
        } else table.push(<div>{a}</div>)
      } else {
        table.push(
          <CreateTableItem
            key={`${i}x${a}`}
            width={i}
            height={a}
            action={() => {
              handlerClick(i, a)
            }}
            active={active[`${i}x${a}`] ? true : false}
          />
          // <button
          //   id={`${i + 1}x${a + 1}`}
          //   className="rooms-create-table-item"
          //   disabled={i < 4 && a < 4 && !(i === 3 && a === 3) ? true : false}
          //   // autoFocus={i === 2 && i === 2 ? true : false}
          // >{` `}</button>
        )
      }
    }
  }

  return <div className="rooms-create-table">{table}</div>
}

export default CreateTable
