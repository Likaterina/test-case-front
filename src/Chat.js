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

    socket.on("allMessages", allMessages => {
      let arr = []
      for (let i in allMessages) {
        console.log(allMessages[i].text)
        arr.push(allMessages[i].text)
      }})

      console.log(token)
      setSocket(socket)
    }, [])

    useEffect(() => {
      console.log(socket)
      if (!socket) return

      console.log("events")
      socket.on("broadcast", data => {
        setUsers(Object.assign(users, data))
      })

      socket.on("message", msg => {
        console.log("message received", msg)
        setMessages([...messages, msg])
      })
    }, [socket, messages, users])

    const sendMessage = () => {
      if (message && message.trim()) {
        socket.emit("message", { text: message })
        setMessage('')
      }
    }

    const handleMessage = e => {
      setMessage(e.target.value)
    }

    const showUsers = () => {
      let arr = []
      console.log(users)
      for (let i in users) {
        console.log(users[i].login)
        if (users[i].online) {
          arr.push(users[i].login)
        }
      }
      console.log(arr)
      return arr.map((i, index) => (<li key={index} >{i}</li>))
    }

    return (

      <div>
        <h2>Let`s talk</h2>
        <input type="text" value={message} onChange={handleMessage} />
        <button onClick={sendMessage}>Send</button>
        <button onClick={props.logout}>logout</button>
        <ul>{
          messages.map((msg, index) => (
            <li key={index}>{msg.text}</li>
          ))}
        </ul>
        <h2>Online</h2>
        <ul>
          {
            showUsers()
          }
        </ul>
      </div>
    )
  }
