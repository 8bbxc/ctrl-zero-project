import api from './api'

const TOKEN_KEY = 'token'

export const getToken = () => localStorage.getItem(TOKEN_KEY)

export const setToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token)
  } else {
    localStorage.removeItem(TOKEN_KEY)
  }
}

export const clearToken = () => localStorage.removeItem(TOKEN_KEY)

export const authHeader = () => {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// هذه الدالة كانت ناقصة وهي سبب الخطأ في الكونسول
export const logout = () => {
  clearToken()
  window.location.href = '/admin/login'
}

export const login = async (email, password) => {
  const response = await api.post('/admin/login', { email, password })
  if (response.data.token) {
    setToken(response.data.token)
  }
  return response.data
}