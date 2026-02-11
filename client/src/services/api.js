import axios from 'axios'
import { getToken, setTokens, logout } from './auth'

// تحديد الرابط الصحيح حسب البيئة
// للـ Production في Vercel: استخدم الـ backend المنشور على Render
// للـ Development محليّاً: استخدم localhost:4000
const BASE_URL = (() => {
  // في Production (Vercel)
  if (import.meta.env.PROD) {
    return 'https://ctrl-zero-0.onrender.com'; // السيرفر الحقيقي على Render
  }
  // في Development محليّاً
  return 'http://localhost:4000';
})();

// نقوم بإضافة /api للرابط
const API_URL = `${BASE_URL}/api`;

console.log('🔗 API URL:', API_URL, '| Environment:', import.meta.env.MODE); // للـ debugging

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // مهم جداً لضمان عمل CORS بشكل صحيح
  timeout: 15000 // Timeout بعد 15 ثانية (زيادة المدة للـ database queries)
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

// 3. Response Interceptor: التعامل مع الأخطاء والتوكن المنتهي
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // إذا كان الخطأ 401 والتوكن منتهي الصلاحية، جرب إعادة تحميل باستخدام refresh token
    if (error.response?.status === 401 && error.response?.data?.code === 'TOKEN_EXPIRED') {
      // تأكد من عدم محاولة التحديث مرارًا وتكرارًا
      if (!originalRequest._retry) {
        originalRequest._retry = true;
        
        try {
          // استدعِ /auth/refresh للحصول على access token جديد
          const refreshResponse = await axios.post(`${BASE_URL}/api/auth/refresh`, {
            refreshToken: localStorage.getItem('refreshToken')
          });

          const { accessToken, refreshToken: newRefreshToken } = refreshResponse.data;
          
          // حفظ التوكنات الجديدة
          setTokens(accessToken, newRefreshToken);

          // أعد محاولة الطلب الأصلي بالتوكن الجديد
          originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          console.error('❌ Token refresh failed:', refreshError.message);
          // إذا فشل التحديث، سجل الخروج
          logout();
          return Promise.reject(refreshError);
        }
      }
    }

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