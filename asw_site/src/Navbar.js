import React, { Component } from 'react';
import App from './App';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

export default class Navbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: this.getUrlPath()
        }
    }

    getUrlPath() {
        if (window.location.pathname.split('/')[1].length === 0) {
            return 'evc';
        } else {
            return window.location.pathname.split('/')[1];
        }
    }

    render() {
        return (
            <Router>
                <div>
                    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                        <Link className="navbar-brand" to="/" onClick={() => this.setState({page: 'evc'})}>EV Addons</Link>
                        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#toggle" aria-controls="Toggle" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div id="toggle" className="collapse navbar-collapse">
                            <ul className="navbar-nav mr-auto">
                                <li className={(this.state.page === 'evc') ? "nav-item active" : "nav-item"} data-toggle="collapse" data-target="#toggle">
                                    <Link className="nav-link" to="/evc" onClick={() => this.setState({page: 'evc'})}>EV Classic</Link>
                                </li>
                                <li className={(this.state.page === 'evo') ? "nav-item active" : "nav-item"} data-toggle="collapse" data-target="#toggle">
                                    <Link className="nav-link" to="/evo" onClick={() => this.setState({page: 'evo'})}>EV Override</Link>
                                </li>
                                <li className={(this.state.page === 'evn') ? "nav-item active" : "nav-item"} data-toggle="collapse" data-target="#toggle">
                                    <Link className="nav-link" to="/evn" onClick={() => this.setState({page: 'evn'})}>EV Nova</Link>
                                </li>
                            </ul>
                        </div>
                    </nav>
                    
                    <Route path="/" exact component={() => <App page={'evc'} />} />
                    <Route path="/evc" exact component={() => <App page={'evc'} />} />
                    <Route path="/evo" component={() => <App page={'evo'} />} />
                    <Route path="/evn" component={() => <App page={'evn'} />} />
                </div>
            </Router>
        )
    }
}