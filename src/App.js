import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Homepage from './pages/Homepage';
import Movies from './pages/Movies';
import './App.css';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Homepage} />
        <Route path="/movies/:id" component={Movies} />
      </Switch>
    </Router>
  )
}

export default App;
