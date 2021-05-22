import { useState, useRef, useEffect } from 'react'
import { useSelector } from 'react-redux'

import socket from '../../socket'

import './styles.css'

function Chat() {
  const chatRef = useRef()
  const user = useSelector((state) => state.user)
  const [data, setData] = useState({ messages: [], message: '' })

  useEffect(() => {
    chatRef.current.scrollTo(
      0,
      chatRef.current.scrollHeight - chatRef.current.clientHeight
    )
  }, [data])

  const handleSubmit = (e) => {
    e.preventDefault()
    socket.emit('chat-global', {
      message: data.message,
    })
    setData({
      messages: [
        ...data.messages,
        { message: data.message, user: user.username || user.name, me: true },
      ],
      message: '',
    })
  }

  socket.on('chat-global', ({ message, user }) => {
    setData({ ...data, messages: [...data.messages, { message, user }] })
  })

  return (
    <>
      <div className="main-item main-chat">
        <h1>Chat</h1>
        <ol ref={chatRef} className="main-chat-messages">
          {data.messages.map((message, index) => (
            <li key={index} className="main-chat-message">
              <div className={message.me ? 'me' : 'you'}>
                <div className="main-chat-message-title">{message.user}</div>
                <div>{message.message}</div>
              </div>
            </li>
          ))}
        </ol>
        <form className="main-chat-form" onSubmit={handleSubmit}>
          <input
            onChange={(e) => {
              setData({ ...data, message: e.target.value })
            }}
            type="text"
            value={data.message}
          />
          <button className="main-chat-send">{'>'}</button>
        </form>
      </div>
    </>
  )
}

export default Chat
