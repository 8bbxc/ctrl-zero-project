import axios from 'axios'
import { getToken } from './auth'

// 1. تحديد الرابط بشكل ذكي (Dynamic Base URL)
// - في Vercel: سيأخذ الرابط من المتغير VITE_API_BASE_URL
// - في جهازك: سيأخذ http://localhost:4000 تلقائياً
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

// نقوم بإضافة /api للرابط سواء كان محلياً أو من السيرفر
const API_URL = `${BASE_URL}/api`;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true // مهم جداً لضمان عمل CORS بشكل صحيح بين Vercel و Render
})

// 2. Request Interceptor: إضافة التوكن
api.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 3. Response Interceptor: التعامل مع الأخطاء
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // السيرفر رد بخطأ (مثل 400 أو 500)
      console.error('❌ API Error:', error.response.data);
      console.error('❌ Status:', error.response.status);
    } else if (error.request) {
      // السيرفر لا يرد (مشكلة شبكة أو السيرفر طافي)
      console.error('⚠️ No response received. Is the server running?');
    } else {
      // خطأ في إعداد الطلب
      console.error('🔥 Request Error:', error.message);
    }
    return Promise.reject(error)
  }
)

export default api