import { Component } from "react";

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("Frontend render error:", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen bg-paper px-6 py-20 text-text">
          <div className="mx-auto max-w-3xl rounded-2xl border border-accent bg-surface p-8">
            <p className="label">Frontend error</p>
            <h1 className="mt-4 font-display text-4xl">React could not render the page</h1>
            <pre className="mt-6 overflow-auto rounded-xl bg-contrast p-4 text-sm text-contrastText">
              {String(this.state.error?.message || this.state.error)}
            </pre>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
