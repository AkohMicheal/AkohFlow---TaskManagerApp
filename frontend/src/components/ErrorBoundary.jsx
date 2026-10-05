import React from 'react';
import { PawPrint, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.removeItem('akohflow_token');
      localStorage.removeItem('akohflow_user');
    } catch (e) {
      // Ignore
    }
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 text-center shadow-xl">
            <div className="inline-flex w-16 h-16 rounded-2xl bg-linear-to-tr from-amber-500 via-orange-500 to-rose-500 text-white items-center justify-center mb-4 shadow-lg shadow-orange-200">
              <PawPrint className="w-8 h-8" />
            </div>
            <h1 className="text-xl font-black text-slate-800 mb-2">FocusPaws Hit a Snag</h1>
            <p className="text-xs text-slate-500 mb-6">
              Our companions ran into an unexpected issue. Don't worry, your progress is safe!
            </p>
            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload Page</span>
              </button>
              <button
                onClick={this.handleReset}
                className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer transition-colors"
              >
                Clear Cache & Restart
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
