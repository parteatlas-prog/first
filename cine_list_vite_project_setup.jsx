// 📁 Project Structure
// cinelist/
// ├── index.html
// ├── package.json
// ├── vite.config.js
// └── src/
//     ├── main.jsx
//     └── App.jsx

// =========================
// 📄 index.html
// =========================
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>CineList</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>

// =========================
// 📄 package.json
// =========================
{
  "name": "cinelist",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "vite": "^5.0.0",
    "@vitejs/plugin-react": "^4.0.0"
  }
}

// =========================
// 📄 vite.config.js
// =========================
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})

// =========================
// 📄 src/main.jsx
// =========================
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

// =========================
// 📄 src/App.jsx
// =========================
// ⚠️ IMPORTANT: Replace your TMDB key with env variable
const TMDB_KEY = import.meta.env.VITE_TMDB_KEY;

// 👇 PASTE YOUR FULL ORIGINAL APP CODE BELOW (unchanged except key)

export default function AppWrapper() {
  return <App />;
}
