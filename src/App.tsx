import React from 'react'
import { Toaster } from 'react-hot-toast'
import { useAuth } from './hooks/useAuth'
import { LoginScreen } from './components/LoginScreen'
import { Dashboard } from './components/Dashboard'
import { isConfigured } from './lib/supabase'
import { AlertCircle } from 'lucide-react'

function App() {
  const { user, loading } = useAuth()

  if (!isConfigured) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Setup Required</h1>
          <p className="text-gray-600 mb-6">
            Please connect to Supabase to start using the application. You need to create a <code className="bg-gray-100 px-2 py-1 rounded text-sm">.env</code> file with your project credentials.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 text-left text-sm overflow-x-auto">
            <pre className="text-gray-700">
              VITE_SUPABASE_URL=...<br />
              VITE_SUPABASE_ANON_KEY=...
            </pre>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <>
      {user ? <Dashboard /> : <LoginScreen />}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            color: '#1f2937',
          },
        }}
      />
    </>
  )
}

export default App