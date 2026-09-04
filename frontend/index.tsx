// FILE: frontend/index.tsx
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Mount the React mini-app inside HashRouter.
//   SCOPE: Locate #root, create the React 18 root, render App under StrictMode
//   DEPENDS: M-FRONTEND-APP
//   LINKS: M-FRONTEND-ENTRY V-M-FRONTEND-ENTRY
//   ROLE: SCRIPT
//   MAP_MODE: LOCALS
// END_MODULE_CONTRACT
// START_MODULE_MAP
//   rootElement - required #root mount node
//   root - React 18 root that renders App
// END_MODULE_MAP
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

import React from 'react';
import ReactDOM from 'react-dom/client';
import {HashRouter} from 'react-router';
import App from './src/app/page';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// START_BLOCK_MOUNT_APP
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <HashRouter>
      <App/>
    </HashRouter>
  </React.StrictMode>
);
// END_BLOCK_MOUNT_APP
