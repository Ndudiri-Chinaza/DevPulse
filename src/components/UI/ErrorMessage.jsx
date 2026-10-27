import { FaExclamationTriangle } from 'react-icons/fa'

export default function ErrorMessage({ message }) {
  return (
    <div className="error-message" role="alert">
      <FaExclamationTriangle aria-hidden="true" />
      <span>{message}</span>
    </div>
  )
}