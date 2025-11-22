import React from 'react'
import { useTheme } from '@/hooks/useTheme'

interface LayoutProps {
  children: React.ReactNode
  title?: string
}

export default function Layout({ children, title = 'TravelHub' }: LayoutProps) {
  const { isDark, toggleTheme } = useTheme()
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <header className="bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-white bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                TravelHub
              </h1>
            </div>
            <div className="flex items-center gap-6">
              <nav className="flex space-x-8">
                <a href="/" className="text-gray-300 hover:text-white transition-colors">
                  Home
                </a>
                <a href="/analyze" className="text-gray-300 hover:text-white transition-colors">
                  Analyze
                </a>
              </nav>
              <button
                onClick={toggleTheme}
                aria-label="Toggle high-contrast mode"
                className="px-3 py-1 rounded-md border border-white/20 bg-white/10 text-white hover:bg-white/20"
              >
                {isDark ? 'High Contrast' : 'Standard'}
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {title && (
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white">{title}</h2>
          </div>
        )}
        {children}
      </main>
    </div>
  )
}