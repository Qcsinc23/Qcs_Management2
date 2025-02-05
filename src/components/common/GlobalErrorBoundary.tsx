import type { ErrorInfo, ReactNode } from 'react'
import React, { Component } from 'react'
import { LoggingService } from '../../services/LoggingService'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

class GlobalErrorBoundary extends Component<Props, State> {
  private logger: LoggingService

  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
    this.logger = LoggingService.getInstance()
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error using the centralized logging service
    this.logger.error('Uncaught error in React component', {
      error: error.toString(),
      componentStack: errorInfo.componentStack,
    })

    // Optional: Send error to error tracking service
    // errorTrackingService.captureException(error, { componentStack: errorInfo.componentStack });
  }

  handleErrorReset = (): void => {
    this.setState({ hasError: false, error: undefined })
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom error UI or fallback prop
      return this.props.fallback
        ? (
            this.props.fallback
          )
        : (
            <div className="error-fallback">
              <h1>Something went wrong</h1>
              <p>{this.state.error?.message}</p>
              <button type="button" onClick={this.handleErrorReset}>
                Try again
              </button>
            </div>
          )
    }

    return this.props.children
  }
}

export default GlobalErrorBoundary
