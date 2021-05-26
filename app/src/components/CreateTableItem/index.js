function CreateTableItem({ width, height, action, active, text = ' ' }) {
  return (
    <button
      disabled={width < 3 || height < 3}
      onClick={action}
      className={`rooms-create-table-item ${active ? 'active' : ''}`}
    >
      {text}
    </button>
  )
}

export default CreateTableItem
