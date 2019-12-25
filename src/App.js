import React, { useState, useEffect } from "react"
import { Chat } from "./Chat"
import { Login } from "./Login"
import * as tokenService from "./tokenService"
import { HOST } from "./constants"

import {
  useHistory,
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


export default function App() {
  const [user, setUser] = useState(undefined)
  const [currentLogin, setCurrentLogin] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  let history = useHistory();

  const getAndSetUser = () => {
    const token = tokenService.getToken()
    if (token) {
      setUser(decode(token))
    }
    console.log(user)
  }

  useEffect(() => {
    getAndSetUser()
  }, [])

  // if (!user)
  // socket.emit('login', { user })

  const loginRequest = e => {
    console.log(HOST)
    e.preventDefault()
    axios
      .post(`${HOST}/auth/login`, {
        login: currentLogin,
        password: currentPassword
      })
      .then(res => {
        tokenService.setToken(res.data.token)
        getAndSetUser();
        window.location.replace('/')
      })
    setCurrentLogin("")
    setCurrentPassword("")
  }

  const logout = () => {
    console.log('logout')
    tokenService.removeToken();     
    setUser(undefined)
    history.push('/login')
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
  )
}

function PrivateRoute({ children, ...rest }) {
  return (
    <Route
      {...rest}
      render={({ location }) => {
        const token = tokenService.getToken()
        if (!token) {
          return <Redirect to="/login" />
        }
        return children
      }}
    />
  )
}
