import { StrictMode } from 'react';
import ReactDOM from 'react-dom';

import App from './components/App/App';
import AppContextProvider from './components/App/AppContext';

import './index.css';

ReactDOM.render(
  <StrictMode>
    <AppContextProvider>
      <App />
    </AppContextProvider>
  </StrictMode>,
  document.getElementById('root'),
);
