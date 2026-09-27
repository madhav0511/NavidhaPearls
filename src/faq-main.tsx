import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { FaqPage } from './FaqPage';
import './index.css';

if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FaqPage />
  </StrictMode>
);
