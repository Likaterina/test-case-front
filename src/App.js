import React, { useState, useEffect } from "react"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom"
import axios from "axios"
import "./App.css"
import { decode } from "jsonwebtoken"
import io from "socket.io-client"

let user = undefined

const socket = io('http://localhost:3228')

export default function App() {
  const [currentLogin, setCurrentLogin] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [users, setUsers] = useState({})

  socket.on("broadcast", data => {
    console.log(data)
    setUsers(data.description)
  })
  console.log(users)

  const getToken = () => localStorage.getItem("token")
  const setToken = token => localStorage.setItem("token", token)
  const removeToken = () => localStorage.removeItem("token")

  const getAndSetUser = () => {
    const token = getToken()
    if (token) {
      user = decode(token)
    }
    console.log(user)
  }
  
  if (user !== undefined) {
    console.log(user._id)
  socket.emit('online', { userId: user._id })
  }

  useEffect(() => {
    getAndSetUser()
  })

  const loginRequest = e => {
    e.preventDefault()
    axios
      .post(`http://localhost:3228/auth/login`, {
        login: currentLogin,
        password: currentPassword
      })
      .then(res => {
        setToken(res.data.token)
        getAndSetUser()
      })
    setCurrentLogin("")
    setCurrentPassword("")
  }

  const logout = () => {
    removeToken()
    user = undefined
  }

  // const getCurrentUser = () => {
  //   axios
  //     .get(`http://localhost:3228/auth/get-current-user`, {
  //       headers: { Authorization: getToken() }
  //     })
  //     .then(res => {
  //       console.log(res)
  //       setUser(undefined)
  //     })
  // }

  const handleLogin = e => {
    setCurrentLogin(e.target.value)
  }

  const handlePassword = e => {
    setCurrentPassword(e.target.value)
  }

  return (
    <Router>
      <div>
        <ul>
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/">Chat</Link>
          </li>
        </ul>

        <hr />
        <Switch>
          <Route exact path="/login">
            <Login
              loginRequest={loginRequest}
              currentLogin={currentLogin}
              currentPassword={currentPassword}
              handleLogin={handleLogin}
              handlePassword={handlePassword}
              // getCurrentUser={getCurrentUser}
              logout={logout}
            />
          </Route>
          <PrivateRoute path="/">
            <Chat
              loginRequest={loginRequest}
              currentLogin={currentLogin}
              currentPassword={currentPassword}
              handleLogin={handleLogin}
              handlePassword={handlePassword}
              // getCurrentUser={getCurrentUser}
              logout={logout}
            />
          </PrivateRoute>
        </Switch>
      </div>
    </Router>
  )
}

function Login(props) {
  return (
    <div>
      <h2>Enter your login and password</h2>
      <form onSubmit={props.loginRequest}>
        <input
          type="text"
          value={props.currentLogin}
          onChange={e => props.handleLogin(e)}
          placeholder="Enter your login"
          autoFocus
        />
        <input
          type="password"
          value={props.currentPassword}
          onChange={e => props.handlePassword(e)}
          placeholder="Enter your password"
        />
        <button onSubmit={props.loginRequest}>Login</button>
      </form>
      <button onClick={props.logout}>logout</button>
    </div>
  )
}

function Chat(props) {
  


  const sendMessage = e => {
    e.preventDefault()
    socket.emit("chat message")
  }

  socket.on('chat message', msg => {
    
  })



  return (
    <div>
      <h2>Let`s talk</h2>
      <form>
        <input type="text" />
        <button onSubmit={e => sendMessage(e)}>Send</button>
      </form>
    </div>
  )
}

function PrivateRoute({ children, ...rest }) {
  return (
    <Route
      {...rest}
      render={({ location }) =>
        user ? (
          children
        ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: location }
              }}
            />
          )
      }
    />
  )
}
