import { Link } from 'react-router-dom'
import { FaCompass } from 'react-icons/fa'

export default function NotFoundPage() {
  return (
    <div className="not-found">
      <FaCompass className="not-found-icon" aria-hidden="true" />
      <strong className="not-found-code">404</strong>
      <h2>Page not found</h2>
      <p>The page you're looking for doesn't exist or has been moved.</p>
      <Link to="/" className="btn btn-primary">
        Back to dashboard
      </Link>
    </div>
  )
}