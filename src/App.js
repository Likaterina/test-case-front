import React, { useState, useEffect } from "react"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom"
import axios from 'axios'
import './App.css'

export default function App() {
  const [user, setUser] = useState({})
  const [currentLogin, setCurrentLogin] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')

  const loginRequest = () => {
    console.log(currentLogin)
    console.log(currentPassword)
    axios.post(`http://localhost:3228/auth/login`, {
      login: currentLogin,
      password: currentPassword
    })
      .then(res => {
        setCurrentLogin('')
        setCurrentPassword('')
        console.log(res)
        console.log(res.data)
      })
  }

  const getCurrentUser = () => {
    axios.get(`http://localhost:3228/auth/get-current-user`, {
      login: currentLogin,
      password: currentPassword
    })
      .then(res => {
        console.log(res)
        setUser(res.data)
      })
  }

  const handleLogin = e => {
    setCurrentLogin(e.target.value)
  }

  const handlePassword = e => {
    setCurrentPassword(e.target.value)
  }

  const sendRequest = () => {

  }

  const logoutRequest = event => {
    event.preventDefault();

    axios.delete(`http://localhost:3228/auth/logout`)
      .then(res => {
        console.log(res);
        console.log(res.data);
      })
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
              getCurrentUser={getCurrentUser}
              user={user}
            />
          </Route>
          <Route path="/">
            <Chat
              loginRequest={loginRequest}
              currentLogin={currentLogin}
              currentPassword={currentPassword}
              handleLogin={handleLogin}
              handlePassword={handlePassword}
              getCurrentUser={getCurrentUser}
              user={user}
            />
          </Route>
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
        <input type='text' value={props.currentLogin} onChange={e => props.handleLogin(e)} placeholder='Enter your login' autoFocus />
        <input type='text' value={props.currentPassword} onChange={e => props.handlePassword(e)} placeholder='Enter your password' />
        <button onSubmit={props.loginRequest}>Login</button>{console.log(props.currentLogin)} {console.log(props.user)}
      </form>
    </div>
  )
}

function Chat(props) {
  useEffect(() => {
    props.loginRequest()
  })

  return (
    <div>
      <h2>Let`s talk</h2>
    </div>
  )
}