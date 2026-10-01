import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ConsultationPage } from './ConsultationPage';
import { FloatingWhatsAppChat } from './components/FloatingWhatsAppChat';
import './index.css';

if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConsultationPage />
    <FloatingWhatsAppChat />
  </StrictMode>
);
