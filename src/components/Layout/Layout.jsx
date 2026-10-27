import { Outlet } from 'react-router-dom'
import Header from '../Header/Header.jsx'
import Sidebar from '../Sidebar/Sidebar.jsx'
import './Layout.css'

export default function Layout() {
  return (
    <div className="layout">
      <Sidebar />
      <div className="layout-main">
        <Header />
        <main className="layout-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}