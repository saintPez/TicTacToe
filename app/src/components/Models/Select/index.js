import { useState } from 'react'

import './styles.css'
import SelectItemModel from '../SelectItem'

function SelectComponent({ text, options, event, className, value }) {
  const opts = []

  const [dropdown, setDw] = useState({
    className: '',
    open: false,
    text: text,
    options: options,
    value: value,
  })

  /*
  const escKey = () => {
    setDw({
      className: '',
      open: false,
    })
  }
  */

  if (options) {
    for (let index = 0; index < options.length; index++) {
      opts.push(
        <SelectItemModel
          text={options[index]}
          key={options[index]}
          event={{
            onClick: (e) => {
              setDw({
                className: '',
                open: false,
                text: e.target.textContent,
                value: e.target.textContent,
              })
            },
          }}
        />
      )
    }
  }

  const functionsClick = () => {
    if (dropdown.open) {
      setDw({
        ...dropdown,
        className: '',
        open: false,
      })
    } else {
      setDw({
        ...dropdown,
        className: 'show',
        open: true,
      })
    }
  }

  return (
    <div className={`dropdown ${className}`} value={dropdown.value}>
      <button
        className="dropdown-btn"
        onClick={functionsClick}
        type="button"
        {...event}
        value={dropdown.value}
      >
        {dropdown.text}
      </button>
      <div className={`dropdown-menu ${dropdown.className}`}>{opts}</div>
    </div>
  )
}

export default SelectComponent
