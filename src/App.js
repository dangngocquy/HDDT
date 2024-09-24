import './App.css';
import React from 'react';

const MST = React.lazy(() => import('./component/MST'));

function App() {
  return (
    <MST />
  );
}

export default App;
