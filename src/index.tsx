import { StrictMode } from 'react';
import ReactDOM from 'react-dom';

import App from './components/App';
import AppContextProvider from './components/AppContext';

import './index.css';

ReactDOM.render(
  <StrictMode>
    <AppContextProvider>
      <App />
    </AppContextProvider>
  </StrictMode>,
  document.getElementById('root'),
);
