import React from "react";
import App from './App';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

const AppRouter = () => (
  <Router>
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/evc">Home</Link>
          </li>
          <li>
            <Link to="/evo">About</Link>
          </li>
          <li>
            <Link to="/evn">Users</Link>
          </li>
        </ul>
      </nav>

      <Route path="/" exact component={() => <App page={'evc'} />} />
      <Route path="/evo" component={() => <App page={'evo'} />} />
      <Route path="/evn" component={() => <App page={'evn'} />} />
    </div>
  </Router>
);

export default AppRouter;