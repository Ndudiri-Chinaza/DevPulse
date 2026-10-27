import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import ErrorBoundary from './components/UI/ErrorBoundary.jsx'
import Layout from './components/Layout/Layout.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import GitHubPage from './pages/GitHubPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import TasksPage from './pages/TasksPage.jsx'

function RoutedApp() {
  const location = useLocation()

  return (
    <ErrorBoundary resetKey={location.pathname}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/github" element={<GitHubPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </ErrorBoundary>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <RoutedApp />
    </BrowserRouter>
  )
}