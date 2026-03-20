import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const token = localStorage.getItem('token')
      if (token) {
        localStorage.removeItem('token')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export const register = (data) => api.post('/auth/register', data)
export const login = (data) => api.post('/auth/login', data)

export const generateExam = (data) => api.post('/tests/generate', data)
export const getMyTests = () => api.get('/tests/my-tests')
export const getTest = (id) => api.get(`/tests/${id}`)

export const submitAttempt = (data) => api.post('/attempts/submit', data)
export const getResults = (id) => api.get(`/attempts/${id}`)

export default api