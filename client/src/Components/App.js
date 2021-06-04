import React, { Component } from 'react';
import { adminLogin, Login, Signup, Home } from './';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/user/home" component={Home} />
          <Route path="/user/login" component={Login} />
          <Route path="/user/signup" component={Signup} />
          <Route path="/admin/login" component={adminLogin} />
        </Switch>
      </Router>
    );
  }
}

export default App;
