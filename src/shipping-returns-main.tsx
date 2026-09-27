import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ShippingReturnsPage } from './ShippingReturnsPage';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ShippingReturnsPage />
  </StrictMode>
);
