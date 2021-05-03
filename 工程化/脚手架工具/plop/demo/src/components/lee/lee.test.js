import React from 'react';
import ReactDOM from 'react-dom';
import lee from './lee';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<lee />, div);
  ReactDOM.unmountComponentAtNode(div);
});
