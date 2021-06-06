import './styles.css'

function SnackbarModel({ className, text, show }) {
  return show ? <div className={className}>{text}</div> : <></>
}

export default SnackbarModel
