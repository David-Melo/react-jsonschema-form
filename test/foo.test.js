import React from 'react';
import { render } from 'react-testing-library';

it('should render', () => {
  const App = () => <div>Hello World!</div>;

  render(<App />);
  expect(true).toBe(true);
});
