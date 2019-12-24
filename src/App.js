import React, { useState, useEffect } from "react"
import { Chat } from './Chat';
import { Login } from './Login';
import * as tokenService from './tokenService';
import HOST from "constants"

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom"
import axios from "axios"
import { decode } from "jsonwebtoken"
import io from "socket.io-client"
import "./App.css"

let user = undefined
const socket = io(HOST)

const getToken = () => localStorage.getItem("token")
const setToken = token => localStorage.setItem("token", token)
const removeToken = () => localStorage.removeItem("token")

export default function App() {
  const [currentLogin, setCurrentLogin] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")


  const getAndSetUser = () => {
    const token = getToken()
    if (token) {
      user = decode(token)
    }
    console.log(user)
  }

  useEffect(() => {
    getAndSetUser()
  })

  if (!user)
  socket.emit('login', { user })

  const loginRequest = e => {
    e.preventDefault()
    axios
      .post(`${HOST}/auth/login`, {
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
            <Chat logout={logout} />
          </PrivateRoute>
        </Switch>
      </div>
    </Router>
  )
}

function PrivateRoute({ children, ...rest }) {
  return (
    <Route
      {...rest}
      render={({ location }) => {
        const token = tokenService.getToken();
        if (!token) {
          return <Redirect to="/login" />
        }

        return children;


      }}
    />
  )
}

