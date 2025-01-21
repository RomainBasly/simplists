import React from 'react'
import { ReactNode } from 'react'

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: { componentStack: string } | null
}

interface ErrorBoundaryProps {
  children: ReactNode
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error: any) {
    // Update state to render the fallback UI
    return { hasError: true, error }
  }

  componentDidCatch(error: any, errorInfo: any) {
    // You can log the error to an error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo)
    this.setState({ errorInfo })
  }

  render() {
    if (this.state.hasError) {
      // Render any custom fallback UI
      return (
        <div role="alert">
          <p>Something went wrong:</p>
          <pre>{this.state.error && this.state.error.toString()}</pre>
          <pre>
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </pre>
        </div>
      )
    }

    return this.props.children
  }
}
