import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import { ExamGenerationProvider } from './contexts/ExamGenerationContext'
import ProtectedRoute from './components/ProtectedRoute'
import GuestRoute from './components/GuestRoute'
import ExamStatusBar from './components/ExamStatusBar'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Generate from './pages/Generate'
import Exam from './pages/Exam'
import Results from './pages/Results'

export default function App() {
  return (
    <AuthProvider>
      <ExamGenerationProvider>
        <>
          <Toaster position="top-right" />
          <Routes>
            <Route path="/" element={<Landing />} />

            <Route path="/login" element={
              <GuestRoute><Login /></GuestRoute>
            } />
            <Route path="/register" element={
              <GuestRoute><Register /></GuestRoute>
            } />

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
          <ExamStatusBar />
        </>
      </ExamGenerationProvider>
    </AuthProvider>
  )
}