import React from 'react';
import ReactDOM from 'react-dom';
import BtrApp from './BtrApp';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<BtrApp />, div);
  ReactDOM.unmountComponentAtNode(div);
});
