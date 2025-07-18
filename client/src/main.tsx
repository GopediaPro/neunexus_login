import { createRoot } from 'react-dom/client'
import './index.css'
import ReactQueryProvider from '@/provider/queryProvider'
import { ThemeProvider } from 'next-themes'
import { AuthProvider } from '@/contexts/auth'
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import App from '@/App'
import { Toaster } from 'sonner'


ModuleRegistry.registerModules([AllCommunityModule]);

const renderApp = () => {
  createRoot(document.getElementById('root')!).render(
    <AuthProvider>
      <ReactQueryProvider>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem={true}
          disableTransitionOnChange={false}
        >
          <App />
          <Toaster 
            richColors
            position='top-right'
            duration={2000}
            closeButton={true}
            toastOptions={{
              style: {
                zIndex: 9999,
              },
            }}
          />
        </ThemeProvider>
      </ReactQueryProvider>
    </AuthProvider>,
  )
}

if (import.meta.env.VITE_MSW_ENABLED === 'true') {
  import('./mocks/browser').then(({ worker }) => {
    worker.start().then(renderApp)
  })
} else {
  renderApp()
}