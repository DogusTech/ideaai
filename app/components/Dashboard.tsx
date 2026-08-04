import { NextPage } from 'next'
import { firebaseAdmin } from '../firebase-admin'

const Dashboard: NextPage = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-white/10 backdrop-blur-sm">
      <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
      <p className="text-lg text-gray-600">Welcome to the dashboard!</p>
    </div>
  )
}

export default Dashboard