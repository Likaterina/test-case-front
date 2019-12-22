import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import './App.css';

export default function BasicExample() {
  const [user, setUser] = useState({})

  useEffect(() => {
    fetch('localhost:3228/auth/get-current-user')
      .then(res => res.json())
      
  })

  return (
    <Router>
      <div>
        <ul>
          <li>
            <Link to="/">Login</Link>
          </li>
          <li>
            <Link to="/dashboard">Chat</Link>
          </li>
        </ul>

        <hr />
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/dashboard">
            <Dashboard />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

function Home() {
  return (
    <div>
      <h2>Enter your login and password</h2>
    </div>
  );
}

function Dashboard() {
  return (
    <div>
      <h2>Let`s talk</h2>
    </div>
  );
}

