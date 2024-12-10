import { createContext, useContext, useState } from 'react'

const LoadingContext = createContext()

export function LoadingProvider({ children }) {
  const [loading, setLoading] = useState(false)
  const [loadingText, setLoadingText] = useState('')

  const showLoading = (text = 'Loading...') => {
    setLoadingText(text)
    setLoading(true)
  }

  const hideLoading = () => {
    setLoading(false)
    setLoadingText('')
  }

  return (
    <LoadingContext.Provider value={{ loading, loadingText, showLoading, hideLoading }}>
      {children}
    </LoadingContext.Provider>
  )
}

export const useLoading = () => {
  const context = useContext(LoadingContext)
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider')
  }
  return context
} 
