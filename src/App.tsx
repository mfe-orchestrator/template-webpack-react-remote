import React from 'react';
import Button from './Button';

const App: React.FC = () => {
  return (
    <div>
      <h1>Remote Microfrontend</h1>
      <p>This is a remote microfrontend and here is the exported button</p>
      <Button />
    </div>
  );
};

export default App;