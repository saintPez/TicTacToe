import { useEffect } from 'react'
import './styles.css'

function Table({ width, height, handleClick, history }) {
  useEffect(() => {
    const box = document.querySelector('.table-item')

    const buttons = document.getElementsByClassName('table-item')

    for (const button of buttons) {
      button.style.height = `${box.offsetWidth}px`
      button.style.fontSize = `${box.offsetWidth}px`
    }
  }, [])

  let table = []

  for (let i = 0; i < width; i++) {
    for (let a = 0; a < height; a++) {
      table.push(
        <button
          key={`${i}x${a}`}
          className="table-item"
          onClick={() => {
            handleClick(a + 1, i + 1)
          }}
        >{`${
          history.find((e) => e.width === a + 1 && e.height === i + 1)?.mark ||
          ''
        }`}</button>
      )
    }
  }

  return (
    <>
      <div className={`board table-${width}`}>{table}</div>
    </>
  )
}

export default Table
