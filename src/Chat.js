import React, { useState, useEffect, useReducer } from "react"
import io from "socket.io-client"
import { HOST } from "./constants"

import * as tokenService from "./tokenService"

export const Chat = props => {
  const [users, addUser] = useReducer(
    (users, newUser) => ({ ...users, ...newUser }),
    {}
  )
  const [socket, setSocket] = useState(null)
  const [messages, addMessages] = useReducer(
    (messages, newMessages) => [...messages, ...newMessages],
    []
  )
  const [message, setMessage] = useState("")

  useEffect(() => {
    console.log("this fucking effect")
    const token = tokenService.getToken()

    if (!token) return

    const socket = io(HOST, {
      query: {
        token
      }
    })

    socket.on("allMessages", allMessages => {
      addMessages(allMessages)
    })

    socket.on("broadcast", data => {
      addUser(data)
    })

    socket.on("message", msg => {
      console.log("message received", msg)
      addMessages([msg])
    })

    setSocket(socket)
  }, [])

  const sendMessage = () => {
    if (message && message.trim()) {
      socket.emit("message", { text: message })
      setMessage("")
    }
  }

  const handleMessage = e => {
    setMessage(e.target.value)
  }

  const showUsers = () =>
    Object.keys(users)
      .filter(key => users[key].online)
      .map((key, index) => <li key={index}>{users[key].login}</li>)

  return (
    <div>
      <h2>Let`s talk</h2>
      <input type="text" value={message} onChange={handleMessage} />
      <button onClick={sendMessage}>Send</button>
      <button onClick={props.logout}>logout</button>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{msg.text}</li>
        ))}
      </ul>
      <h2>Online</h2>
      <ul>{showUsers()}</ul>
    </div>
  )
}
