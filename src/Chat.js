import React, { useState, useEffect } from "react"
import io from "socket.io-client"

import * as tokenService from './tokenService';

export const Chat = (props) => {

    const [socket, setSocket] = useState(null)
    useEffect(() => {
        const token = tokenService.getToken();
     
        const socket = io('http://localhost:3228', {
            query: {
                token
            }
        })

    }, [])
    
    // const sendMessage = e => {
    //   e.preventDefault()
    //   socket.emit("chat message")
    // }
  
    // socket.on('chat message', msg => {
      
    // })
  
  
  
    return (
      <div>
        <h2>Let`s talk</h2>
        <form>
          <input type="text" />
          <button>Send</button>
        </form>
      </div>
    )
  }