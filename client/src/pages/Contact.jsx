import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaPaperPlane, FaWhatsapp, FaLinkedinIn, FaGithub } from 'react-icons/fa'
import { ImSpinner8 } from 'react-icons/im'
import api from '../services/api'

export default function Contact() {
  const { t, i18n } = useTranslation()
  const dir = i18n.dir()

  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    subject: '', 
    message: '' 
  })
  const [status, setStatus] = useState('idle') // idle, loading, success, error

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')

    try {
      const res = await api.post('/contact', formData)

      if (res && (res.status === 201 || res.status === 200)) {
        setStatus('success')
        setFormData({ name: '', email: '', subject: '', message: '' })
        // Reset بسرعة أكثر
        setTimeout(() => setStatus('idle'), 3000)
      } else {
        setStatus('error')
        setTimeout(() => setStatus('idle'), 3000)
      }
    } catch (err) {
      console.error('Contact submit failed:', err?.message || err)
      setStatus('error')
      // التعامل مع الأخطاء بسرعة
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  return (
    <div className="min-h-screen py-12 sm:py-20 lg:py-24 relative overflow-hidden flex items-center bg-slate-950 text-slate-50 font-sans selection:bg-accent selection:text-black">
      
      {/* --- الخلفية الموحدة (Atmospheric Background) --- */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-blue-600/10 rounded-full blur-[80px] sm:blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-purple-600/10 rounded-full blur-[80px] sm:blur-[120px]" />
        {/* شبكة الزخرفة */}
        <div className="absolute inset-0 bg-[url('/images/grid.svg')] opacity-[0.03]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-start">

          {/* 1. الجانب الأيسر: معلومات التواصل */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.6 }}
            className={`space-y-8 sm:space-y-10 order-2 lg:order-1 ${dir === 'rtl' ? 'lg:order-2' : 'lg:order-1'}`}
          >
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-white mb-3 sm:mb-6 leading-tight break-words">
                {t('contact.title') || 'Get in Touch'}
                <motion.span 
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="inline-block text-cyan-400 ml-2"
                >
                  •
                </motion.span>
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-slate-400 leading-relaxed break-words">
                {t('contact.subtitle') || "Have a project in mind? We would love to hear from you. Let's build something amazing together."}
              </p>
            </div>

            {/* بطاقات المعلومات */}
            <div className="space-y-3 sm:space-y-5">
              <ContactCard 
                icon={<FaEnvelope />} 
                title={t('contact.email') || 'Email'} 
                value="yazanbusiness124@gmail.com" 
                link="mailto:yazanbusiness124@gmail.com"
                color="text-blue-400"
              />
              <ContactCard 
                icon={<FaPhoneAlt />} 
                title={t('contact.phone') || 'Phone'} 
                value="+970 568 203 031" 
                link="tel:+970568203031"
                color="text-green-400"
              />
              <ContactCard 
                icon={<FaMapMarkerAlt />} 
                title={t('contact.location') || 'Location'} 
                value={dir === 'rtl' ? 'فلسطين، نابلس' : 'Nablus, Palestine'}
                color="text-red-400"
              />
            </div>

            {/* سوشيال ميديا */}
            <div>
              <h3 className="text-white font-bold mb-3 sm:mb-4 uppercase tracking-widest text-xs">{t('contact.social') || 'Follow Us'}</h3>
              <div className="flex gap-3 sm:gap-4">
                 <SocialBtn icon={<FaWhatsapp />} link="https://wa.me/qr/ZEUXAVWSSI44K1" color="hover:bg-green-600 hover:border-green-600" />
                 <SocialBtn icon={<FaLinkedinIn />} link="https://www.linkedin.com/in/yazan-saadeh/" color="hover:bg-blue-600 hover:border-blue-600" />
                 <SocialBtn icon={<FaGithub />} link="https://github.com/8bbxc" color="hover:bg-gray-800 hover:border-gray-800" />
              </div>
            </div>
          </motion.div>

          {/* 2. الجانب الأيمن: النموذج (Form) */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`bg-slate-900/60 backdrop-blur-xl border border-white/10 p-5 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl shadow-2xl relative order-1 lg:order-2 ${dir === 'rtl' ? 'lg:order-1' : 'lg:order-2'}`}
          >
            {/* زخرفة ضوئية */}
            <div className="absolute -top-10 -right-10 w-20 sm:w-32 h-20 sm:h-32 bg-accent/20 rounded-full blur-3xl pointer-events-none" />

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 relative z-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <InputGroup label={t('contact.name') || 'Name'} name="name" value={formData.name} onChange={handleChange} required placeholder={t('contact.namePlaceholder') || 'Full Name'} />
                <InputGroup label={t('contact.email') || 'Email'} name="email" type="email" value={formData.email} onChange={handleChange} required placeholder={t('contact.emailPlaceholder') || 'email@example.com'} />
              </div>
              <InputGroup label={t('contact.subject') || 'Subject'} name="subject" value={formData.subject} onChange={handleChange} required placeholder={t('contact.subjectPlaceholder') || 'Project Inquiry'} />
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
                  {t('contact.message') || 'Message'}
                </label>
                <textarea 
                  name="message" 
                  rows="4" 
                  value={formData.message} 
                  onChange={handleChange}
                  required
                  placeholder={t('contact.messagePlaceholder') || 'Tell us about your project...'}
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 sm:px-5 py-3 sm:py-4 text-sm sm:text-base text-white focus:outline-none focus:border-accent focus:bg-black/40 transition-all resize-none placeholder-slate-600"
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={status === 'loading'}
                className="w-full py-3 sm:py-4 rounded-xl bg-accent text-black font-bold text-base sm:text-lg hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:-translate-y-1 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 sm:gap-3"
              >
                {status === 'loading' ? (
                  <> <ImSpinner8 className="animate-spin text-sm sm:text-base" /> <span className="text-sm sm:text-base">{t('loading') || 'Sending...'}</span> </>
                ) : (
                  <> <FaPaperPlane className="text-sm sm:text-base" /> <span className="text-sm sm:text-base">{t('contact.send') || 'Send Message'}</span> </>
                )}
              </button>

              {/* رسائل الحالة */}
              {status === 'success' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-3 sm:p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-center text-xs sm:text-sm font-bold">
                  {t('contact.sent') || 'Message sent successfully!'}
                </motion.div>
              )}
              {status === 'error' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-3 sm:p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-center text-xs sm:text-sm font-bold">
                  {t('contact.failed') || 'Failed to send message.'}
                </motion.div>
              )}
            </form>
          </motion.div>

        </div>
      </div>
    </div>
  )
}

// --- Components ---

function InputGroup({ label, name, type = "text", value, onChange, required, placeholder }) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">{label}</label>
      <input 
        type={type} 
        name={name} 
        value={value} 
        onChange={onChange} 
        required={required}
        placeholder={placeholder}
        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 sm:px-5 py-3 sm:py-3.5 text-sm sm:text-base text-white focus:outline-none focus:border-accent focus:bg-black/40 transition-all placeholder-slate-600"
      />
    </div>
  )
}

function ContactCard({ icon, title, value, link, color }) {
  return (
    <a href={link || '#'} className={`flex items-center gap-3 sm:gap-5 p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-slate-900/40 border border-white/5 hover:border-white/10 hover:bg-slate-800/60 transition-all group ${!link ? 'cursor-default' : ''}`}>
      <div className={`w-12 sm:w-14 h-12 sm:h-14 flex-shrink-0 rounded-full bg-slate-800 flex items-center justify-center text-lg sm:text-2xl ${color} shadow-lg group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">{title}</div>
        <div className="text-white font-medium text-sm sm:text-lg group-hover:text-accent transition-colors break-words">{value}</div>
      </div>
    </a>
  )
}

function SocialBtn({ icon, link, color }) {
  return (
    <a 
      href={link} 
      target="_blank" 
      rel="noreferrer" 
      className={`w-10 sm:w-12 h-10 sm:h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-slate-300 hover:text-white transition-all hover:scale-110 ${color}`}
    >
      <span className="text-lg sm:text-xl">{icon}</span>
    </a>
  )
}