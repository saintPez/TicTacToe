import './styles.css'

function Modal({ show, title, body, onCancel, onAccept, cancel, accept }) {
  return (
    <>
      {show ? (
        <div className="modal">
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h1>{title}</h1>
            </div>
            <div className="modal-body">{body}</div>
            <div className="modal-footer">
              <button className="button modal-footer-button" onClick={onAccept}>
                {accept || 'Accept'}
              </button>
              <button className="button modal-footer-button" onClick={onCancel}>
                {cancel || 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  )
}

export default Modal
