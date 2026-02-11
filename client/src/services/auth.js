import api from './api'

const TOKEN_KEY = 'accessToken'
const REFRESH_TOKEN_KEY = 'refreshToken'

export const getToken = () => localStorage.getItem(TOKEN_KEY)

export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY)

export const setTokens = (accessToken, refreshToken) => {
  if (accessToken) {
    localStorage.setItem(TOKEN_KEY, accessToken)
  }
  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
  }
}

export const setToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token)
  } else {
    localStorage.removeItem(TOKEN_KEY)
  }
}

export const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}

export const authHeader = () => {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// Logout: clear tokens and redirect to login
export const logout = () => {
  clearToken()
  window.location.href = '/admin/login'
}

// Login: submit credentials and store both tokens
export const login = async (email, password) => {
  const response = await api.post('/admin/login', { email, password })
  if (response.data.accessToken && response.data.refreshToken) {
    setTokens(response.data.accessToken, response.data.refreshToken)
  }
  return response.data
}

// Refresh access token using refresh token
export const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken()
  if (!refreshToken) {
    logout()
    return null
  }

  try {
    const response = await api.post('/admin/refresh', { refreshToken })
    if (response.data.accessToken && response.data.refreshToken) {
      setTokens(response.data.accessToken, response.data.refreshToken)
    }
    return response.data
  } catch (error) {
    console.error('❌ Refresh failed:', error.message)
    logout()
    return null
  }
}
