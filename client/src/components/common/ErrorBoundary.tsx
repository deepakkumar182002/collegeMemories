import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-surface text-on-surface">
          <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-outline-variant text-center">
            <div className="w-16 h-16 bg-error-container text-error rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="font-headline text-2xl font-bold text-primary mb-2">Something Went Wrong</h2>
            <p className="text-on-surface-variant text-sm mb-6">
              A temporary issue occurred while loading this memory page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-primary text-white px-6 py-2.5 rounded-full font-montserrat text-sm font-semibold hover:bg-primary-container transition-colors inline-flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Reload Memory Box
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
