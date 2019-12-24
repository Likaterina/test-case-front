import React, { useState, useEffect } from "react"
import io from "socket.io-client"
import HOST from "constants"

import * as tokenService from './tokenService';

export const Chat = (props) => {
    const [users, setUsers] = useState({})
    const [socket, setSocket] = useState(null)

    
    
    useEffect(() => {
        const token = tokenService.getToken();
     
        const socket = io(HOST, {
            query: {
                token
            }
        })

    }, [])
 
    //socket.on("broadcast", data => {
    //  console.log(data)
    //  setUsers(data)
    //})
    //.log(users)
    
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
          <button onClick={props.logout}>logout</button>
        </form>
      </div>
    )
  }