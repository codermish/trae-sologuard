import SoloGuardDashboard from '@/components/SoloGuardDashboard';
import { Shield, Zap, Eye } from 'lucide-react';

export default function SoloGuardAnalysisPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
      </div>
      
      {/* Header */}
      <div className="relative z-10 pt-8 pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 mb-4">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-full">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              SoloGuard AI
            </h1>
          </div>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
            Advanced code analysis powered by artificial intelligence. Detect hallucinations, assess risks, and ensure code security with intelligent scoring.
          </p>
          
          {/* Feature badges */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
              <div className="flex items-center space-x-2">
                <Eye className="w-4 h-4 text-blue-300" />
                <span className="text-blue-100 text-sm">Hallucination Detection</span>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-green-300" />
                <span className="text-blue-100 text-sm">Security Analysis</span>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-yellow-300" />
                <span className="text-blue-100 text-sm">Risk Assessment</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Dashboard */}
      <div className="relative z-10">
        <SoloGuardDashboard />
      </div>
      
      {/* Footer */}
      <div className="relative z-10 mt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <h3 className="text-lg font-semibold text-white mb-2">Powered by Advanced AI</h3>
            <p className="text-blue-200 text-sm">
              SoloGuard uses sophisticated machine learning models to analyze code patterns and detect potential issues before they become problems.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}