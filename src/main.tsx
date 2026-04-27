import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import { AuthSync } from './lib/AuthSync'
import { TrpcProvider } from './lib/trpc'
import './styles.css'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <TrpcProvider queryClient={queryClient}>
          <AuthSync>
            <App />
          </AuthSync>
        </TrpcProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
)
