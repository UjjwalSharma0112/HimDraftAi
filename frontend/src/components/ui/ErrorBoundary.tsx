import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
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
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-container-bg flex flex-col items-center justify-center p-6 text-center font-sans">
          <div className="max-w-md w-full bg-surface-bg border border-outline-border p-8 rounded-[12px] shadow-lg space-y-6">
            <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-lg font-bold text-primary-text uppercase tracking-wide">
                Something went wrong
              </h2>
              <p className="text-xs text-secondary-text leading-relaxed">
                An unexpected error occurred while rendering this page.
              </p>
              {this.state.error && (
                <pre className="text-[10px] font-mono bg-container-bg border border-outline-border p-3 rounded text-left text-red-600 dark:text-red-400 overflow-x-auto max-h-32">
                  {this.state.error.message}
                </pre>
              )}
            </div>

            <button
              onClick={this.handleRetry}
              className="w-full bg-primary-text text-container-bg hover:opacity-90 font-semibold text-xs py-2.5 rounded-[4px] transition cursor-pointer"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
