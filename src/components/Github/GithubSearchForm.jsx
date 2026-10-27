import { useState } from 'react'

export default function GithubSearchForm({ onSearch }) {
  const [username, setUsername] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    onSearch(username.trim())
  }

  return (
    <form className="github-form" onSubmit={handleSubmit}>
      <label htmlFor="github-username" className="visually-hidden">
        GitHub username
      </label>
      <input
        id="github-username"
        className="text-input"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter GitHub username"
        autoComplete="off"
        spellCheck="false"
      />
      <button type="submit" className="btn btn-primary">
        Track
      </button>
    </form>
  )
}