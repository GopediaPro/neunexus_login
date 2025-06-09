import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import ReactQueryProvider from './provider/queryProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <ReactQueryProvider>
    <StrictMode>
      <App />
    </StrictMode>
  </ReactQueryProvider>,
)
