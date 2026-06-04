import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError() {
    return {
      hasError: true,
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error(
      "UI Error:",
      error,
      errorInfo
    );
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-[#0A0A0A] px-4">
          <div className="max-w-md rounded-3xl border border-red-500/30 bg-[#111111] p-8 text-center">
            <h1 className="mb-4 text-3xl font-bold text-red-400">
              Something Went Wrong
            </h1>

            <p className="mb-6 text-zinc-400">
              An unexpected error occurred.
            </p>

            <button
              onClick={() =>
                window.location.reload()
              }
              className="rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#F59E0B] px-6 py-3 font-semibold text-white"
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