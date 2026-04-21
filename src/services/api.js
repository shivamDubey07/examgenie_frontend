import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // needed so refresh token cookie is sent
})

// In-memory token — survives React re-renders, not page refresh
// Page refresh recovery is handled by AuthContext calling /me on mount
let _accessToken = null
let _authRedirectInFlight = false
const PUBLIC_PATHS = new Set(['/', '/login', '/register'])

export const setAccessToken = (token) => {
  _accessToken = token
}

export const getAccessToken = () => _accessToken

export const clearAccessToken = () => {
  _accessToken = null
}

const shouldRedirectToLogin = () => {
  return !PUBLIC_PATHS.has(window.location.pathname)
}

// Track if we're already refreshing to prevent multiple parallel refresh calls
let _isRefreshing = false
let _refreshSubscribers = []

const onRefreshed = (token) => {
  _refreshSubscribers.forEach((cb) => cb(token))
  _refreshSubscribers = []
}

const addRefreshSubscriber = (cb) => {
  _refreshSubscribers.push(cb)
}

// Attach access token to every request
api.interceptors.request.use((config) => {
  if (_accessToken) {
    config.headers.Authorization = `Bearer ${_accessToken}`
  }
  return config
})

// On 401, try to refresh once then retry the original request
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Don't intercept refresh or login endpoints — would cause infinite loop
    const isAuthEndpoint =
      originalRequest.url?.includes('/auth/refresh') ||
      originalRequest.url?.includes('/auth/login')

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true

      if (_isRefreshing) {
        // Queue this request until refresh completes
        return new Promise((resolve) => {
          addRefreshSubscriber((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            resolve(api(originalRequest))
          })
        })
      }

      _isRefreshing = true

      try {
        const response = await api.post('/auth/refresh')
        const newToken = response.data.access_token
        setAccessToken(newToken)
        onRefreshed(newToken)
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return api(originalRequest)
      } catch (refreshError) {
        // Refresh failed — user needs to log in again
        clearAccessToken()
        _refreshSubscribers = []
        if (!_authRedirectInFlight && shouldRedirectToLogin()) {
          _authRedirectInFlight = true
          window.location.assign('/login')
        }
        return Promise.reject(refreshError)
      } finally {
        _isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

// Auth
export const register = (data) => api.post('/auth/register', data)
export const login = (data) => api.post('/auth/login', data)
export const logout = () => api.post('/auth/logout')
export const getMe = () => api.get('/auth/me')
export const refreshToken = () => api.post('/auth/refresh')

// Exams
export const generateExam = (data) => api.post('/exam/generate', data)
export const getExamStatus = (id) => api.get(`/exam/${id}/status`)
export const getExam = (id) => api.get(`/exam/${id}`)
export const getMyTests = () => api.get('/exam/my-exams')
export const startExam = (id) => api.post(`/exam/${id}/start`)

// Attempts
export const saveAnswer = (data) => api.post('/attempts/answer', data)
export const sendHeartbeat = (data) => api.post('/attempts/heartbeat', data)
export const abandonAttempt = (data) => api.post('/attempts/abandon', data)
export const submitAttempt = (data) => api.post('/attempts/submit', data)
export const getResults = (id) => api.get(`/attempts/${id}`)

export default api
