import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import ReactQueryProvider from '@/provider/queryProvider'
import App from '@/App'

const renderApp = () => {
  createRoot(document.getElementById('root')!).render(
    <ReactQueryProvider>
      <StrictMode>
        <App />
      </StrictMode>
    </ReactQueryProvider>,
  )
}

if (import.meta.env.VITE_MSW_ENABLED === 'true') {
  import('./mocks/browser').then(({ worker }) => {
    worker.start().then(renderApp)
  })
} else {
  renderApp()
}