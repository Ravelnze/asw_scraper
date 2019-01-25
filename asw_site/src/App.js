import React, { Component } from 'react';
import './App.css';
import AddonCollection from './AddonCollection';
import evcBanner from './img/escape_velocity_banner.png';
import evoBanner from './img/ev_override_banner.png';
import evnBanner from './img/evn_banner.png';
import ScrollUpButton from "react-scroll-up-button";

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      value: "",
      category: ""
    }
    this.loadHandler = this.loadHandler.bind(this)
    this.changeHandler = this.changeHandler.bind(this)
    this.categoryHandler = this.categoryHandler.bind(this)
  }

  componentWillMount() {
    if (this.props.page === 'evo') {
      this.setState({
        banner: evoBanner,
        title: "Override"
      });
    }
    else if(this.props.page === 'evn') {
      this.setState({
        banner: evnBanner,
        title: "Nova"
      });
    }
    else {
      this.setState({
        banner: evcBanner,
        title: "Classic"
      });
    }
  }

  componentDidMount() {
    document.title = "EV Addons | " + this.state.title;
  }

  loadHandler() {
    this.setState({
      loading: false
    });
  }

  changeHandler(event) {
    this.setState({ value: event.target.value });
  }

  categoryHandler(cat) {
    this.setState({category: cat})
  }

  render() {
    return (
      <div>
        <ScrollUpButton />
        {/* Loader */}
        <div className={this.state.loading ? "d-flex justify-content-center align-items-center" : "d-none"}>
          <div className="spinner-grow spinner-grow-lg text-dark" role="status"/>
          <div className="spinner-grow spinner-grow-lg text-dark" role="status"/>
          <div className="spinner-grow spinner-grow-lg text-dark" role="status"/>
        </div>

        {/* Main Container */}
        <div className={this.state.loading ? "d-none" : "container"}>
          {/* Banner */}
          <div className="row pt-3">
            <div className="col">
              <div className="d-flex justify-content-center">
                <img src={this.state.banner} className="img-fluid" alt="Escape Velocity Banner"></img>
              </div>
            </div>
          </div>

          {/* Filter */}
          <div className="row pt-3">
            <div className="col">
              <div className="d-flex justify-content-center">
                <div className="btn-group btn-group-sm flex-wrap" role="group" aria-label="Category buttons">
                  <button type="button" className={this.state.category === "" ? "btn btn-light active" : "btn btn-light"} onClick={() => this.categoryHandler("")}>All</button>
                  <button type="button" className={this.state.category === "plugins" ? "btn btn-light active" : "btn btn-light"} onClick={() => this.categoryHandler("plugins")}>Plugins</button>
                  <button type="button" className={this.state.category === "cheats" ? "btn btn-light active" : "btn btn-light"} onClick={() => this.categoryHandler("cheats")}>Cheats</button>
                  <button type="button" className={this.state.category === "guides" ? "btn btn-light active" : "btn btn-light"} onClick={() => this.categoryHandler("guides")}>Guides</button>
                  <button type="button" className={this.state.category === "miscellaneous" ? "btn btn-light active" : "btn btn-light"} onClick={() => this.categoryHandler("miscellaneous")}>Miscellaneous</button>
                  <button type="button" className={this.state.category === "utilities" ? "btn btn-light active" : "btn btn-light"} onClick={() => this.categoryHandler("utilities")}>Utilities</button>
                  <button type="button" className={this.state.category === "scenarios" ? "btn btn-light active" : "btn btn-light"} onClick={() => this.categoryHandler("scenarios")}>Scenarios</button>
                </div>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="row">
            <div className="col">
              <form className="form mt-3">
                  <input autoComplete="false" className="form-control" type="search" value={this.state.value} placeholder="Search" aria-label="Search" onChange={this.changeHandler} />
              </form>
            </div>
          </div>

          {/* Content */}
          <div className="row">
            <div className="col">
              <ul className="no-style">
                <AddonCollection loadHandler={this.loadHandler} url={this.props.page} searchValue={this.state.value} category={this.state.category} />
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}