import { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, ArrowLeft, Home } from "lucide-react";

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
    console.error("Uncaught exception caught by boundary:", error, errorInfo);
  }

  private handleRefresh = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  private handleGoBack = () => {
    this.setState({ hasError: false, error: null });
    window.history.back();
  };

  private handleGoDashboard = () => {
    this.setState({ hasError: false, error: null });
    // Adjust this string path if your main dashboard route lives somewhere else (e.g., "/dashboard")
    window.location.href = "/";
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[70vh] w-full flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white border border-slate-300 rounded-2xl shadow-sm p-6 sm:p-8 text-center flex flex-col items-center gap-5">
            {/* Soft warning icon badge */}
            <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shadow-sm shrink-0">
              <AlertTriangle className="w-6 h-6 stroke-[2.5]" />
            </div>

            <div className="flex flex-col gap-1.5">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Something went wrong here
              </h2>
              <p className="text-xs font-semibold text-slate-600 leading-relaxed max-w-sm">
                The page ran into an unexpected issue. Try refreshing the
                window, or head back to safety using the options below.
              </p>
            </div>

            {/* EXPANDED SYSTEM LOG: ONLY VISIBLE DURING LOCAL DEVELOPMENT */}
            {process.env.NODE_ENV === "development" && this.state.error && (
              <div className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-left overflow-auto max-h-36 font-mono text-[10px] text-rose-700 font-bold whitespace-pre-wrap">
                {this.state.error.stack || this.state.error.toString()}
              </div>
            )}

            {/* Functional, accessible action tree */}
            <div className="w-full flex flex-col gap-2.5 mt-2">
              <button
                type="button"
                onClick={this.handleRefresh}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl transition-colors shadow-sm shadow-indigo-100"
              >
                <RefreshCw className="w-3.5 h-3.5 stroke-[2.5]" />
                Refresh Page
              </button>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={this.handleGoBack}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold text-slate-700 border border-slate-300 bg-white hover:bg-slate-50 active:bg-slate-100 rounded-xl transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5 stroke-[2.5]" />
                  Go Back
                </button>

                <button
                  type="button"
                  onClick={this.handleGoDashboard}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold text-slate-700 border border-slate-300 bg-white hover:bg-slate-50 active:bg-slate-100 rounded-xl transition-colors"
                >
                  <Home className="w-3.5 h-3.5 stroke-[2.5]" />
                  Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
