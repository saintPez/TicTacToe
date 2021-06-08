import { useState } from 'react'

import './styles.css'

function SelectComponent({
  text,
  options,
  event,
  className,
  value,
  chooseOption,
}) {
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

  /*
  let dropdownObject = {}
  dropdownObject[dropdown.id] = {}
  */

  const d1 = (e) => {
    setDw({
      ...dropdown,
      className: '',
      open: false,
      text: e.target.textContent,
      value: e.target.textContent,
    })
  }

  if (options) {
    for (let index = 0; index < options.length; index++) {
      opts.push(
        <div
          key={options[index]}
          value={options[index]}
          onClick={(a) => {
            d1(a)
            chooseOption(a)
          }}
          className="dropdown-item"
          tabIndex="1"
        >
          {options[index]}
        </div>
        /*
        <SelectItemModel
          text={options[index]}
          value={options[0]}
          key={options[index]}
          action={(e) => {
            setDw({
              ...dropdown,
              className: '',
              open: false,
              text: e.target.textContent,
              value: e.target.textContent,
            })

            dropdownObject[dropdown.id][value] = e.target.textContent
          }}
        />
        */
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
        type="button"
        {...event}
        value={dropdown.value}
        onClick={functionsClick}
      >
        {dropdown.text}
      </button>
      <div className={`dropdown-menu ${dropdown.className}`}>{opts}</div>
    </div>
  )
}

export default SelectComponent
