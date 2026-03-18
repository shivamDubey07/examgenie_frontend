import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../services/api'
import toast from 'react-hot-toast'

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      console.log('Login:', form)
      const response = await login(form)
      localStorage.setItem('token', response.data.access_token)
      localStorage.setItem('token_type', response.data.token_type)
      toast.success('Login successful, redirecting...')
      navigate('/dashboard')
    } catch (err) {
      setError('Invalid email or password.',err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900 flex items-center justify-center px-4">
      <div className="bg-white/10 backdrop-blur rounded-2xl p-8 w-full max-w-md">

        <h1 onClick={() => navigate('/')} className="text-2xl font-bold text-white text-center mb-1 cursor-pointer">
          Exam<span className="text-blue-400">Genie</span>
        </h1>
        <p className="text-blue-200 text-center text-sm mb-8">Welcome back!</p>

        {error && (
          <div className="bg-red-500/20 text-red-300 text-sm px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-blue-200 text-sm mb-1 block">Email</label>
            <input
              name="email"
              type="email"
              placeholder="john@example.com"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full bg-white/10 text-white placeholder-blue-300 border border-white/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400"
            />
          </div>
          <div>
            <label className="text-blue-200 text-sm mb-1 block">Password</label>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full bg-white/10 text-white placeholder-blue-300 border border-white/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-400 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition mt-2">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-blue-200 text-sm text-center mt-6">
          Don't have an account?{' '}
          <span onClick={() => navigate('/register')} className="text-blue-400 hover:underline cursor-pointer">
            Sign up free
          </span>
        </p>

      </div>
    </div>
  )
}