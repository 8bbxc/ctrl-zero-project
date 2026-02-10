import React, { useEffect, useState, Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

// --- Lazy Load Pages ---
const Home = React.lazy(() => import('./pages/Home'))
const Projects = React.lazy(() => import('./pages/Projects'))
const ProjectDetails = React.lazy(() => import('./pages/ProjectDetails'))
const SectorProjects = React.lazy(() => import('./pages/SectorProjects'))
const About = React.lazy(() => import('./pages/About'))
const Contact = React.lazy(() => import('./pages/Contact'))
const Services = React.lazy(() => import('./pages/Services')) // صفحة القائمة
const ServiceDetails = React.lazy(() => import('./pages/ServiceDetails')) // صفحة التفاصيل
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'))
const NotFound = React.lazy(() => import('./pages/NotFound'))
const Login = React.lazy(() => import('./pages/Login'))

// --- Components ---
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Loader from './components/Loader'
import FloatingWhatsApp from './components/FloatingWhatsApp'

export default function App() {
  const location = useLocation()
  const { i18n } = useTranslation()
  const [loading, setLoading] = useState(false)

  // 1. إدارة اللغة والاتجاه (RTL/LTR)
  useEffect(() => {
    const isArabic = i18n.language === 'ar'
    const htmlElement = document.documentElement
    htmlElement.setAttribute('dir', isArabic ? 'rtl' : 'ltr')
    htmlElement.setAttribute('lang', isArabic ? 'ar' : 'en')
    
    // تعيين الخط بناءً على اللغة
    if (isArabic) {
      htmlElement.style.fontFamily = 'Cairo, sans-serif'
    } else {
      htmlElement.style.fontFamily = 'Inter, sans-serif'
    }
  }, [i18n.language])

  // 2. التمرير للأعلى عند تغيير الصفحة
  useEffect(() => {
    window.scrollTo(0, 0)
    // تشغيل اللودر للحظات عند الانتقال
    setLoading(true)
    const t = setTimeout(() => setLoading(false), 800) 
    return () => clearTimeout(t)
  }, [location.pathname])

  // 3. منطق إخفاء الناف بار والفوتر في لوحة التحكم
  const isAdminRoute = location.pathname.startsWith('/admin')

  // 4. منطق الصفحات ذات العرض الكامل (بدون هوامش جانبية)
  // هذه الصفحات تأخذ عرض الشاشة بالكامل لأنها تحتوي على Hero Sections كبيرة
  const isFullWidthPage = 
    location.pathname === '/' || 
    location.pathname.startsWith('/admin') ||
    // تفاصيل المشاريع وقطاعات المشاريع
    (location.pathname.startsWith('/projects/') && location.pathname !== '/projects') ||
    // تفاصيل الخدمات (عشان الهيرو سكشن الملون)
    (location.pathname.startsWith('/services/') && location.pathname !== '/services')

  return (
    <div className="min-h-screen flex flex-col bg-[#050505] text-slate-50 overflow-x-hidden selection:bg-cyan-500/30 selection:text-white">
      
      {/* إخفاء الناف بار في الأدمن */}
      {!isAdminRoute && <Navbar />}

      <main 
        className={`flex-1 w-full relative z-10 transition-all duration-300 ${
          isAdminRoute || isFullWidthPage 
            ? '' // عرض كامل للصفحات المحددة
            : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12' // هوامش للصفحات العادية
        }`}
      >
        <Suspense fallback={<Loader />}>
          <Routes>
            {/* === الرئيسية === */}
            <Route path="/" element={<Home />} />
            
            {/* === المشاريع === */}
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/sector/:sector" element={<SectorProjects />} />
            <Route path="/projects/:slug" element={<ProjectDetails />} />
            
            {/* === الخدمات (الحل الجذري للمشكلة) === */}
            {/* 1. هذا الرابط يعرض قائمة الخدمات (البطاقات) */}
            <Route path="/services" element={<Services />} />
            
            {/* 2. هذا الرابط يعرض تفاصيل خدمة واحدة (الصفحة الملونة) */}
            <Route path="/services/:id" element={<ServiceDetails />} />
            
            {/* === صفحات عامة === */}
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            
            {/* === الأدمن === */}
            <Route path="/admin/login" element={<Login />} />
            <Route path="/admin/*" element={<AdminDashboard />} />
            
            {/* === 404 === */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>

      {/* إخفاء الفوتر والواتساب في الأدمن */}
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <FloatingWhatsApp />}

      {/* مؤشر التحميل العام */}
      {loading && <Loader />}
    </div>
  )
}