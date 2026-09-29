import React, { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error) {
    // Log sanitized error message only — no stack trace or user data
    console.error('ErrorBoundary:', error.message.substring(0, 200))
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="text-center p-8">
          <h2 className="text-2xl text-red-400 mb-4">Something went wrong</h2>
          <p className="text-slate-400">Please refresh the page</p>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary