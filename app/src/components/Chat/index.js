import { useState } from 'react'
import { useSelector } from 'react-redux'

import { io } from 'socket.io-client'

import './styles.css'

const socket = io('http://localhost:3001')

function Chat() {
  const user = useSelector((state) => state.user)
  const [data, setData] = useState({ messages: [], message: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    socket.emit('chat-global', {
      message: data.message,
      user: user.username || user.name,
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
    console.log('se')
    setData({ ...data, messages: [...data.messages, { message, user }] })
  })

  return (
    <>
      <div className="home-item home-chat">
        <h1>Chat</h1>
        <ol className="home-chat-messages">
          {data.messages.map((message, index) => (
            <li key={index} className="chat">
              <div className={message.me ? 'me' : 'you'}>
                <div className="chat-title">{message.user}</div>
                <div className="chat-message">{message.message}</div>
              </div>
            </li>
          ))}
        </ol>
        <form className="home-chat-form" onSubmit={handleSubmit}>
          <input
            onChange={(e) => {
              setData({ ...data, message: e.target.value })
            }}
            type="text"
            value={data.message}
          />
          <button className="home-chat-send">{'>'}</button>
        </form>
      </div>
    </>
  )
}

export default Chat
