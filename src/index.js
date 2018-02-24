import 'whatwg-fetch';
import './index.scss';
import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import App from './components/App';

/**
 * Importing service workers availability
 */
import runtime from 'serviceworker-webpack-plugin/lib/runtime';

/**
 * Check if serviceWorker is supported
 */
if ('serviceWorker' in navigator) {
  console.log('Registering a service worker...');
  const registration = runtime.register();
} else {
  console.log('Failure to register a service worker!');
}


render(
  <AppContainer>
    <App />
  </AppContainer>,
  document.getElementById('app'),
);

if (module.hot) {
  module.hot.accept();
}
