import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import Rutas from './Rutas';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from './components/store';
import ThemeCustomization from './components/themes';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ReduxProvider store={store}>
      <BrowserRouter>
        <ThemeCustomization>
          <Rutas />
        </ThemeCustomization>
      </BrowserRouter>
    </ReduxProvider>
  </React.StrictMode>
);

reportWebVitals();
