import Navbar from './Navbar'
import Login from './Login'
import Register from './Register'
import Dashboard from './Dashboard'

const App = () => {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <main className="flex-1 p-4">
        <Login />
        <Register />
        <Dashboard />
      </main>
    </div>
  )
}

export default App