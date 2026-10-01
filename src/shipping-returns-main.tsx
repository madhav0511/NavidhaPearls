import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ShippingReturnsPage } from './ShippingReturnsPage';
import { FloatingWhatsAppChat } from './components/FloatingWhatsAppChat';
import './index.css';

if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ShippingReturnsPage />
    <FloatingWhatsAppChat />
  </StrictMode>
);
