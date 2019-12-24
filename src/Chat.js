import React, { useState, useEffect, useImperativeHandle } from "react"
import io from "socket.io-client"
import { HOST } from "./constants"

import * as tokenService from "./tokenService"

export const Chat = props => {
  const [users, setUsers] = useState({})
  const [socket, setSocket] = useState(null)
  const [messages, setMessages] = useState([])
  const [message, setMessage] = useState("")

  useEffect(() => {
    const token = tokenService.getToken()

    if (!token) return

    const socket = io(HOST, {
      query: {
        token
      }
    })
    setSocket(socket)
  }, [])

  useEffect(() => {
    console.log(socket)
    if (!socket) return

    console.log("events")
    socket.on("broadcast", data => {
      console.log("broadcast")
      setUsers(data)
    })

    socket.on("message", msg => {
      console.log("message received", msg)
      setMessages([...messages, msg])
    })
  }, [socket, messages])

  const sendMessage = () => {
    socket.emit("message", { text: message })
  }

  const handleMessage = e => {
    setMessage(e.target.value)
  }

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
    </div>
  )
}
