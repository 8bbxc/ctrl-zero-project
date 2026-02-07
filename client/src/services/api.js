import axios from 'axios'
import { getToken } from './auth'

// 1. الرابط الأساسي: يوجه الطلبات مباشرة للسيرفر (Port 4000)
// هذا يحل مشكلة الـ 404 التي تظهر لأن المتصفح يحاول الاتصال بـ 5173
const API_URL = 'http://localhost:4000/api' 

const api = axios.create({
  baseURL: API_URL
})


// 2. Request Interceptor: يضيف التوكن قبل إرسال الطلب
api.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    // (اختياري) للتأكد في الكونسول أن الرابط صحيح
    // console.log(`Sending request to: ${config.baseURL}${config.url}`) 
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 3. Response Interceptor (إضافة جديدة مهمة):
// يساعدنا في معرفة سبب الخطأ فوراً في الكونسول
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // طباعة تفاصيل الخطأ في الكونسول لتسهيل الحل
    if (error.response) {
      console.error('API Error Response:', error.response.data);
      console.error('Status Code:', error.response.status);
    } else if (error.request) {
      console.error('No response received (Server might be down):', error.request);
    } else {
      console.error('Request Setup Error:', error.message);
    }
    return Promise.reject(error)
  }
)

export default api