import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import ReactQueryProvider from '@/provider/queryProvider'
import { ThemeProvider } from 'next-themes'
import { AuthProvider } from './contexts/AuthContext';
import App from '@/App'

const renderApp = () => {
  createRoot(document.getElementById('root')!).render(
    <ReactQueryProvider>
      <ThemeProvider
        attribute='class'
        defaultTheme='system'
        enableSystem
        disableTransitionOnChange={false}
      >
        <AuthProvider>
          <StrictMode>
            <App />
          </StrictMode>
        </AuthProvider>
      </ThemeProvider>
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