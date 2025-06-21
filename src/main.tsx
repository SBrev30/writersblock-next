import './sentry'; // Initialize Sentry FIRST
import React from 'react';
import ReactDOM from 'react-dom/client';
import EnhancedCanvas from './components/EnhancedCanvasWithSentry';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <EnhancedCanvas />
  </React.StrictMode>,
);