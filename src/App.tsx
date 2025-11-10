import { NavLink, Outlet } from 'react-router-dom'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="sticky top-0 z-10 backdrop-blur bg-white/80 border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <NavLink to="/" className="text-xl font-semibold">🌍 World Data Dashboard</NavLink>
          <nav className="flex gap-4 text-sm">
            <NavLink to="/" className={({isActive}) => isActive ? 'font-medium underline' : ''}>Home</NavLink>
            <NavLink to="/about" className={({isActive}) => isActive ? 'font-medium underline' : ''}>About</NavLink>
          </nav>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-6">
        <Outlet />
      </main>
      <footer className="max-w-6xl mx-auto px-4 py-10 text-center text-xs text-gray-500">
        Data from REST Countries (v3). This app fetches public data over HTTPS.
      </footer>
    </div>
  )
}