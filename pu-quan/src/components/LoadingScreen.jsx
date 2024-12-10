import { Spin } from 'antd'
import { useLoading } from '@/contexts/LoadingContext'

function LoadingScreen() {
  const { loading, loadingText } = useLoading()

  if (!loading) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <Spin size="large" />
        {loadingText && (
          <div className="mt-4 text-gray-600">{loadingText}</div>
        )}
      </div>
    </div>
  )
}

export default LoadingScreen 
