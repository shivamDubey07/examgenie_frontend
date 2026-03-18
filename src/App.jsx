import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Generate from './pages/Generate'
import Exam from './pages/Exam'
import Results from './pages/Results'

export default function App() {
  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/generate" element={<Generate />} />
        <Route path="/exam/:id" element={<Exam />} />
        <Route path="/results/:id" element={<Results />} />
      </Routes>
    </>
  )
}