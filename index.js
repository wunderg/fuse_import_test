import React from 'react';
import reactDOM from 'react-dom';

const App = () => <div>Hello World</div>;

const root = document.getElementById('root');

setTimeout(function(){
  FuseBox.import('./test.js', function(m) {
    console.log(m);
  });
}, 3000)
reactDOM.render(<App />, root);
