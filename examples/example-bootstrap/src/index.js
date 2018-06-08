import React from 'react';
import { render } from 'react-dom';
import { HashRouter as Router } from 'react-router-dom';
import { AppContainer } from 'react-hot-loader';

import App from './components/App';

const load = () =>
  render(
    <Router>
      <AppContainer>
        <App />
      </AppContainer>
    </Router>,
    document.getElementById('root')
  );

if (module.hot) {
  module.hot.accept('./components/App', load);
}

load();
