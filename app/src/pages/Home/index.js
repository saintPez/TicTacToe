import { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'

import './styles.css'

function Home() {
  const history = useHistory()
  const user = useSelector((state) => state.user)

  useEffect(() => {
    if (user.room) history.push('/leave')
    if (user.queue) history.push('/leave-queue')
    // eslint-disable-next-line react-hooks/exhaustive-deps

    /*
    for (let i = 0; i < items.length; i++) {
      items.addEventListener('click', () => {
        let val = document.querySelector('div[value=' + this.value + ']')

        if (val) {
          items[i].style.display = 'none'
          val.style.display = 'block'
        }
      })
    }
    */
  }, [])

  const items_model = document.getElementsByClassName('item-content')

  const handleClickOn = (e) => {
    let val = e.target.getAttribute('list-value')
    //val = document.querySelector(`div[list-value=${val}]`)
    val = document.getElementById(val)

    for (let i = 0; i < items_model.length; i++) {
      items_model[i].style.display = 'none'
      val.style.display = 'block'
    }
  }

  return (
    <>
      <div className="main-item">
        <ul className="list-menu">
          <li className="item-model" list-value="about" onClick={handleClickOn}>
            About
          </li>
          <li
            className="item-model"
            list-value="policy"
            onClick={handleClickOn}
          >
            Privacy Policy
          </li>
          <li className="item-model" list-value="terms" onClick={handleClickOn}>
            Terms of use
          </li>
        </ul>
        <div className="menu-load">
          <div id="about" className="item-content show">
            TicTacToe es una aplicación de juego, inspirada en tres en raya o
            tres en línea. Que te permite compartir con amigos. Crear juegos
            personalizados, donde puedes jugar solo y jugar en línea.
            <br />
            TicTacToe además permite que hables con tus amigos por el medio del
            Chat mientras juegas, este chat es a nivel global. Para que puedas
            interactuar con tus amigos y con otras personas dentro de la
            prataforma.
          </div>
          <div id="policy" className="item-content">
            En la política de privacidad de TicTacToe, prometemos proteger la
            información de nuestros usuarios.
            <br />
            Además toda la información que recopilamos sea nombre, correo
            eléctronico y otros aspectos más relacionados con el historial de
            cada partida jugada o aspectos del juego. Son usados para mejorar
            nuestros servicios y no hacemos uso de ellos para fines lucrativos.
          </div>
          <div id="terms" className="item-content">
            Nuestros términos de uso resaltan los siguientes puntos para cada
            usuario.
            <br />
            <ol className="m-p">
              <li>
                Si usted es parte de TicTacToe, debe respetar a los miembros de
                la comunidad.
              </li>
              <li>
                Si usted habla desde el chat, deberá ser respetuoso con los
                demás miembros.
              </li>
            </ol>
          </div>
        </div>
      </div>
    </>
  )
}

export default Home
