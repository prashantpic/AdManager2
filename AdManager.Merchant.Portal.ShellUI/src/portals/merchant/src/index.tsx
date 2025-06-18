/**
 * @file src/portals/merchant/src/index.tsx
 * @description Main entry point for the React application.
 * This file is responsible for initializing and mounting the main React application component (`App`)
 * into the DOM. It uses `ReactDOM.createRoot()` for concurrent mode rendering.
 *
 * As per SDS 3.1.5, this file structure and logic are typical for a Vite or Create React App setup.
 * For a Next.js application (which is the specified technology stack for this project),
 * the primary application bootstrapping, including global providers and layout,
 * is typically handled by `src/pages/_app.tsx`. This `index.tsx` file, if used in a
 * Next.js project without being part of the `pages` directory, would not serve as
 * the main Next.js application entry point.
 *
 * @purpose Initializes and mounts the main React application component.
 * @implementedFeatures ApplicationBootstrapping
 * @namespace AdManager.Merchant.UI
 * @metadata {"Category":"Bootstrapping"}
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Assuming App.tsx is located in the same directory: src/portals/merchant/src/

// Any global pre-render setup can be initialized here.
// For example, if global CSS is not handled by components or _app.tsx (in Next.js context):
// import './styles/global.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  // In a production environment, you might want to handle this more gracefully
  // or ensure 'root' always exists via _document.tsx in Next.js.
  console.error(
    "Fatal Error: The root element with ID 'root' was not found in the HTML document. React application cannot be mounted.",
  );
  throw new Error(
    "Failed to find the root element. Ensure an element with ID 'root' exists in your HTML.",
  );
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);