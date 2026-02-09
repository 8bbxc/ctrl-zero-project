import React, { useEffect, useState, Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'

// Lazy Load Pages
const Home = React.lazy(() => import('./pages/Home'))
const Projects = React.lazy(() => import('./pages/Projects'))
const ProjectDetails = React.lazy(() => import('./pages/ProjectDetails'))
const SectorProjects = React.lazy(() => import('./pages/SectorProjects'))
const About = React.lazy(() => import('./pages/About'))
const Contact = React.lazy(() => import('./pages/Contact'))
const Services = React.lazy(() => import('./pages/Services'))
const ServiceDetails = React.lazy(() => import('./pages/ServiceDetails')) // صفحة تفاصيل الخدمة الجديدة
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'))
const NotFound = React.lazy(() => import('./pages/NotFound'))
const Login = React.lazy(() => import('./pages/Login'))

// Components
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Loader from './components/Loader'
import FloatingWhatsApp from './components/FloatingWhatsApp'

export default function App() {
  const location = useLocation()
  const { i18n } = useTranslation()
  const [loading, setLoading] = useState(false)

  // Update HTML dir and lang attributes based on language
  useEffect(() => {
    const isArabic = i18n.language === 'ar'
    const htmlElement = document.documentElement
    htmlElement.setAttribute('dir', isArabic ? 'rtl' : 'ltr')
    htmlElement.setAttribute('lang', isArabic ? 'ar' : 'en')
    htmlElement.classList.toggle('rtl', isArabic)
    // Add supports for font-family switcher
    if (isArabic) {
      htmlElement.style.fontFamily = 'Cairo, sans-serif'
    } else {
      htmlElement.style.fontFamily = 'Inter, sans-serif'
    }
  }, [i18n.language])

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0)
    setLoading(true)
    const t = setTimeout(() => setLoading(false), 800) 
    return () => clearTimeout(t)
  }, [location.pathname])

  // التحقق هل نحن في صفحة الأدمن؟ لإخفاء الناف بار والفوتر
  const isAdminRoute = location.pathname.startsWith('/admin')

  // التحقق هل الصفحة تحتاج عرض كامل (بدون حواف)؟
  // مثل الصفحة الرئيسية، وصفحات التفاصيل، والأدمن، والـ sector pages
  const isFullWidthPage = 
    location.pathname === '/' || 
    location.pathname.startsWith('/admin') ||
    (location.pathname.startsWith('/services/') && location.pathname !== '/services') ||
    (location.pathname.startsWith('/projects/') && !location.pathname.endsWith('/projects'))

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-50 overflow-x-hidden selection:bg-accent selection:text-black">
      
      {/* إخفاء الناف بار في صفحات الأدمن */}
      {!isAdminRoute && <Navbar />}

      {/* التحكم في الستايل بناءً على الصفحة:
         - صفحات الأدمن: لا يوجد ستايل إضافي (تأخذ راحتها).
         - صفحات التفاصيل والرئيسية: لا يوجد ستايل (عشان الصور تكون عريضة).
         - باقي الصفحات (About, Contact): نضيف لها Padding و Container عشان المحتوى يكون مرتب.
      */}
      <main className={`flex-1 w-full relative z-10 ${
        isAdminRoute || isFullWidthPage 
          ? '' 
          : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12'
      }`}>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/sector/:sector" element={<SectorProjects />} />
            <Route path="/projects/:slug" element={<ProjectDetails />} />
            
            <Route path="/services" element={<Services />} />
            <Route path="/services/:id" element={<ServiceDetails />} /> {/* الراوت الجديد */}
            
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<Login />} />
            <Route path="/admin/*" element={<AdminDashboard />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>

      {/* إخفاء الفوتر في صفحات الأدمن */}
      {!isAdminRoute && <Footer />}
      
      {/* إخفاء الواتساب في صفحات الأدمن */}
      {!isAdminRoute && <FloatingWhatsApp />}

      {/* Global Loader */}
      {loading && <Loader />}
    </div>
  )
}