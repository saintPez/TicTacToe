import './styles.css'

function Table({ width, height, handleClick, history }) {
  let table = []

  for (let i = 0; i < width; i++) {
    for (let a = 0; a < height; a++) {
      table.push(
        <button
          key={`${i}x${a}`}
          className={`table-item`}
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
      <div className="table">{table}</div>
    </>
  )
}

export default Table
