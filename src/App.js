import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { io } from 'socket.io-client';
import CodeEditor from './components/CodeEditor';
import Login from './components/Login';
import Signup from './components/Signup';
import './App.css';

const socket = io('http://localhost:5000');

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route path="/" component={CodeEditor} />
      </Switch>
    </Router>
  );
}

export default App;
