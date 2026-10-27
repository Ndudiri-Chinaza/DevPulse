import { Component } from 'react'
import { FaExclamationTriangle } from 'react-icons/fa'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('DevPulse error boundary caught:', error, info)
  }

  componentDidUpdate(prevProps) {
    if (this.props.resetKey !== prevProps.resetKey && this.state.hasError) {
      this.setState({ hasError: false })
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary" role="alert">
          <span className="error-boundary-icon" aria-hidden="true">
            <FaExclamationTriangle />
          </span>
          <h2>Something went wrong</h2>
          <p>An unexpected error occurred while rendering this view.</p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => window.location.reload()}
          >
            Reload dashboard
          </button>
        </div>
      )
    }

    return this.props.children
  }
}