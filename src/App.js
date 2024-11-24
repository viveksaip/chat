// src/App.js

import React from 'react';
import './App.css';
import ChatBox from './ChatBox';  // Import the ChatBox component

function App() {
  return (
      <div className="App">
          <h1>What can I help you legally?</h1>
        <ChatBox />
      </div>
    
  );
}

export default App;
