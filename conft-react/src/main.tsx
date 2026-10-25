import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/montserrat';
import './styles/tokens.css';
import './styles/globals.css';
import App from './App';

const root = document.getElementById('root');
if (!root) throw new Error('Elemento #root não encontrado');

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
