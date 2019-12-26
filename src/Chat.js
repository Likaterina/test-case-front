import React, { useState, useEffect, useReducer } from "react"
import io from "socket.io-client"
import { HOST } from "./constants"

import * as tokenService from "./tokenService"


function messageReducer(state, action) {
  switch (action.type) {
    case 'add':
      return state.concat(action.payload)
    case 'set':
      return action.payload;
    default:
      throw new Error();
  }
}



export const Chat = props => {
  const [users, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null)
  const [message, setMessage] = useState("");

  const [messages, dispatch] = useReducer(messageReducer, []);

  useEffect(() => {


    const token = tokenService.getToken()

    if (!token) return

    const socket = io(HOST, {
      query: {
        token
      }
    })

    socket.on("allMessages", (payload) => {
      dispatch({
        type: 'set',
        payload
      })
    })

    socket.on("message", (payload) => {
      dispatch({
        type: 'add',
        payload
      })
    })

    socket.on("broadcast", setOnlineUsers)
    
    setSocket(socket)
  }, [])


  const sendMessage = () => {
    console.log(users)
    if (message && message.trim()) {
      socket.emit("message", { text: message })
      setMessage("")
    }
  }

  const handleMessage = e => {
    setMessage(e.target.value)
  }

  const bunUser = () => {

  }

  const muteUser = (user) => {
    console.log(users)
    socket.emit("muteUser", user)
  }

  const showUsers = () =>
    Object.keys(users)
      .map(key => {
        const user = users[key]
        return (
          <li key={user._id}>{user.login}
            {props.currentUser.isAdmin && !user.isAdmin && <div>
              <button>Bun</button>
              <button onClick={muteUser(user)}>Mute</button>
            </div>
            }
          </li>
        )
      })


  return (
    <div>
      <h2>Let`s talk</h2>
      <input type="text" value={message} onChange={handleMessage} />
      <button onClick={sendMessage}>Send</button>
      <button onClick={(e) => {
        socket.disconnect()
        props.logout(e)
      }}>logout</button>
      <ul>
        {messages.map((msg) => {
          return <li key={msg._id}>{msg.userName}: {msg.text}</li>
        })
        }
      </ul>
      <h2>Online</h2>
      <ul>{showUsers()}</ul>
    </div>
  )
}
