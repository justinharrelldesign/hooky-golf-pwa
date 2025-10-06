import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '../App'
import '../styles/globals.css'

// Register Service Worker for PWA functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('Service Worker registered:', registration);
      })
      .catch((error) => {
        console.log('Service Worker registration failed:', error);
      });
  });
}

// Prevent external links from breaking out of standalone mode on iOS
// This keeps users in the PWA when clicking any links
if (window.matchMedia('(display-mode: standalone)').matches) {
  window.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const anchor = target.closest('a');
    
    if (anchor && anchor.href) {
      const url = new URL(anchor.href, window.location.href);
      
      // Only intercept same-origin links
      if (url.origin === window.location.origin) {
        // Allow normal navigation within the app
        return;
      } else {
        // External link - prevent default and handle specially
        e.preventDefault();
        
        // For external links, open in new window/tab if needed
        // This prevents breaking out of standalone mode
        if (anchor.target === '_blank') {
          window.open(anchor.href, '_blank');
        }
      }
    }
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
