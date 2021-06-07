import { useState, useEffect } from 'react'

import CreateTableItem from '../CreateTableItem'

import './styles.css'

function CreateTable({ config, setConfig }) {
  const [active, setActive] = useState({})

  useEffect(() => {
    const box = document.querySelector('.rooms-create-table-item')

    const buttons = document.getElementsByClassName('rooms-create-table-item')

    for (const button of buttons) {
      button.style.height = `${box.offsetWidth}px`
      button.style.fontSize = `${box.offsetWidth}px`
    }

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
          if (i === 0) table.push(<div key="center">{` `}</div>)
          else table.push(<div key={`column-${i}`}>{i}</div>)
        } else table.push(<div key={`row-${a}`}>{a}</div>)
      } else {
        table.push(
          <CreateTableItem
            key={`${a}x${i}`}
            width={a}
            height={i}
            action={() => {
              handlerClick(a, i)
            }}
            active={active[`${a}x${i}`] ? true : false}
          />
        )
      }
    }
  }

  return <div className="rooms-create-table">{table}</div>
}

export default CreateTable
