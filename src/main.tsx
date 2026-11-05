import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// Inter is bundled locally — no font API call (NFR-09)
import '@fontsource/inter/400.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import './styles/tokens.css';
import './styles/app.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
