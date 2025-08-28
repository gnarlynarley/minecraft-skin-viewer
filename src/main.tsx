import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <React.Suspense
      fallback={
        <div className="h-screen w-screen flex items-center justify-center">
          <h1>loading</h1>
        </div>
      }
    >
      <App />
    </React.Suspense>
  </React.StrictMode>
);
