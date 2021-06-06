import './styles.css'

function SelectItemModel({ text, event }) {
  /*
  const closeMenu = () => {
    console.log('Model')
  }
  */

  return (
    <div className="dropdown-item" tabIndex="1" {...event}>
      {text}
    </div>
  )
}

export default SelectItemModel
