import React, { Component } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import Main from '../components/Main';
import Search from '../components/Search';
import FourZeroFour from '../components/FourZeroFour';
import { Router, Route, Link, browserHistory } from 'react-router'

class App extends Component {

  render() {
    return (
    <Router history={browserHistory}>
        <Route path="/" component={Main} />
        <Route path="/search" component={Search}/>
        <Route path="*" component={FourZeroFour}/>
    </Router>
    );
  }
}

export default App;
