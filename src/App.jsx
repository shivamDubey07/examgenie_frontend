import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Generate from './pages/Generate'
import Exam from './pages/Exam'
import Results from './pages/Results'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={
        <ProtectedRoute><Dashboard /></ProtectedRoute>
      } />
        <Route path="/generate" element={
        <ProtectedRoute><Generate /></ProtectedRoute>
      } />
        <Route path="/exam/:id" element={
        <ProtectedRoute><Exam /></ProtectedRoute>
      } />
        <Route path="/results/:id" element={
        <ProtectedRoute><Results /></ProtectedRoute>
      } />
      </Routes>
    </>
  )
}