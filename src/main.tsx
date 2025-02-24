import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import GlobalErrorBoundary from './components/common/GlobalErrorBoundary'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GlobalErrorBoundary>
      <App />
    </GlobalErrorBoundary>
  </React.StrictMode>,
)
