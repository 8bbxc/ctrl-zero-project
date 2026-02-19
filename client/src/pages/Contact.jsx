import React, { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaPaperPlane, FaWhatsapp, FaLinkedinIn, FaGithub, FaCheck, FaTimes } from 'react-icons/fa'
import { ImSpinner8 } from 'react-icons/im'
import api from '../services/api'

// (ملاحظة: لا تقم باستيراد الفوتر هنا، لأنه موجود في App.jsx)

export default function Contact() {
  const { t, i18n } = useTranslation()
  const dir = i18n.dir()
  const isArabic = i18n.language === 'ar'

  // --- 1. المنطق البرمجي (كما هو في كودك الأصلي تماماً) ---
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    subject: '', 
    message: '' 
  })
  const [status, setStatus] = useState('idle') 
  const [statusMessage, setStatusMessage] = useState('')
  const [hoveredCard, setHoveredCard] = useState(null)
  const messageRef = useRef(null)

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const isValidEmail = (email) => {
    if (!email) return false
    // Basic email regex
    return /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Prevent double submits
    if (status === 'loading') return

    // Client-side validation
    const trimmedMessage = (formData.message || '').trim()
    if (!trimmedMessage || trimmedMessage.length < 5) {
      setStatus('error')
      setStatusMessage('Message is required (min 5 characters).')
      messageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      setTimeout(() => setStatus('idle'), 3000)
      return
    }

    if (formData.email && !isValidEmail(formData.email)) {
      setStatus('error')
      setStatusMessage('Please provide a valid email address.')
      messageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      setTimeout(() => setStatus('idle'), 3000)
      return
    }

    setStatus('loading')
    setStatusMessage('')

    try {
      const res = await api.post('/api/contact', formData)

      if (res && (res.status === 201 || res.status === 200)) {
        setStatus('success')
        setStatusMessage('Message sent successfully!')
        setFormData({ name: '', email: '', subject: '', message: '' })
        messageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        setTimeout(() => setStatus('idle'), 4000)
      } else {
        const msg = (res && res.data && res.data.error) ? res.data.error : 'Failed to send message. Please try again.'
        setStatus('error')
        setStatusMessage(msg)
        messageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        setTimeout(() => setStatus('idle'), 3000)
      }
    } catch (err) {
      console.error('Contact submit failed:', err?.message || err)
      const serverMsg = err?.response?.data?.error || err?.message || 'Network or Server error. Please try again later.'
      setStatus('error')
      setStatusMessage(serverMsg)
      messageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      setTimeout(() => setStatus('idle'), 4000)
    }
  }

  // --- 2. إعدادات الأنيميشن ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <div className={`min-h-screen relative bg-[#030712] text-slate-50 font-sans selection:bg-cyan-500/30 pt-10 pb-20 ${dir}`}>
      
      {/* === خلفية حيوية وهادئة (Ambient Background) === */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Gradients */}
        <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-blue-900/10 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] bg-purple-900/10 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
        {/* Noise Texture لتقليل حدة الألوان */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
      </div>

      {/* === المحتوى الرئيسي === */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-7xl">
        
        {/* --- العنوان --- */}
        <motion.div 
          initial={{ opacity: 0, y: -30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8 }}
          className="text-center mb-16 lg:mb-24 mt-12"
        >
          <span className="inline-block py-1 px-3 rounded-full bg-cyan-900/20 border border-cyan-500/20 text-cyan-400 font-mono text-xs uppercase tracking-[0.3em] mb-6 backdrop-blur-md">
            {t('contact.btn') || (isArabic ? 'هيا نتحدث' : 'LET’S TALK')}
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight leading-tight">
            {t('contact.title')}
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
            {t('contact.subtitle') || (isArabic 
              ? "لديك مشروع في ذهنك؟ نود أن نسمع منك. دعنا نبني شيئاً مذهلاً معاً." 
              : "Have a project in mind? We would love to hear from you. Let's build something amazing together.") }
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-20 items-start">

          {/* === الجهة اليسرى (أو اليمنى بالعربي): معلومات الاتصال === */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6 md:space-y-8 order-2 lg:order-1"
          >
            <motion.div variants={itemVariants}>
              <ContactCard 
                icon={<FaEnvelope />} 
                title={t('contact.email') || (isArabic ? 'البريد الإلكتروني' : 'Email')} 
                value="yazanbusiness124@gmail.com" 
                link="mailto:yazanbusiness124@gmail.com"
                color="text-cyan-400"
                bg="bg-cyan-500/10"
                border="group-hover:border-cyan-500/50"
                index={0} onHover={setHoveredCard} hoveredCard={hoveredCard}
              />
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <ContactCard 
                icon={<FaPhoneAlt />} 
                title={t('contact.phone') || (isArabic ? 'الهاتف' : 'Phone')} 
                value="+970 568 203 031" 
                link="tel:+970568203031"
                color="text-emerald-400"
                bg="bg-emerald-500/10"
                border="group-hover:border-emerald-500/50"
                index={1} onHover={setHoveredCard} hoveredCard={hoveredCard}
              />
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <ContactCard 
                icon={<FaMapMarkerAlt />} 
                title={t('contact.location') || (isArabic ? 'الموقع' : 'Location')} 
                value={isArabic ? 'فلسطين، نابلس' : 'Nablus, Palestine'}
                color="text-purple-400"
                bg="bg-purple-500/10"
                border="group-hover:border-purple-500/50"
                index={2} onHover={setHoveredCard} hoveredCard={hoveredCard}
              />
            </motion.div>

            {/* أيقونات السوشيال ميديا */}
            <motion.div variants={itemVariants} className="pt-6 md:pt-8 border-t border-white/5">
              <h3 className="text-slate-400 font-mono text-xs uppercase tracking-[0.2em] mb-4 md:mb-6">
                {t('contact.social') || (isArabic ? 'تابعنا على' : 'Follow Us')}
              </h3>
              <div className="flex gap-4 md:gap-5">
                 <SocialBtn icon={<FaWhatsapp />} link="https://wa.me/qr/ZEUXAVWSSI44K1" color="hover:text-green-400" />
                 <SocialBtn icon={<FaLinkedinIn />} link="https://www.linkedin.com/in/yazan-saadeh/" color="hover:text-blue-400" />
                 <SocialBtn icon={<FaGithub />} link="https://github.com/8bbxc" color="hover:text-white" />
              </div>
            </motion.div>
          </motion.div>

          {/* === الجهة اليمنى (أو اليسرى بالعربي): نموذج الاتصال === */}
          <motion.div 
            initial={{ opacity: 0, x: dir === 'rtl' ? -50 : 50 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.8, delay: 0.2 }}
            className="order-1 lg:order-2 w-full"
          >
            <div className="relative group">
              {/* توهج خلفي للنموذج */}
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-3xl md:rounded-[2.5rem] blur opacity-12 group-hover:opacity-28 transition duration-700" />
              
              <div className="relative bg-[#0A0A0A] border border-white/10 p-6 md:p-8 lg:p-12 rounded-3xl md:rounded-[2.5rem] shadow-2xl w-full lg:max-w-xl lg:mx-0">
                
                <h3 className="text-xl md:text-2xl font-bold text-white mb-6 md:mb-8">
                  {t('contact.formTitle') || (isArabic ? 'أرسل لنا رسالة' : 'Send us a message')}
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <InputGroup 
                      label={t('contact.name') || (isArabic ? 'الاسم' : 'Name')} 
                      name="name" 
                      value={formData.name} 
                      onChange={handleChange} 
                      required 
                      placeholder={isArabic ? 'اسمك الكريم' : 'Your Name'} 
                      dir={dir} 
                    />
                    <InputGroup 
                      label={t('contact.email') || (isArabic ? 'البريد الإلكتروني' : 'Email')} 
                      name="email" 
                      type="email" 
                      value={formData.email} 
                      onChange={handleChange} 
                      required 
                      placeholder="name@example.com" 
                      dir="ltr" 
                    />
                  </div>

                  <InputGroup 
                    label={t('contact.subject') || (isArabic ? 'الموضوع' : 'Subject')} 
                    name="subject" 
                    value={formData.subject} 
                    onChange={handleChange} 
                    required 
                    placeholder={isArabic ? 'عنوان المشروع' : 'Project Inquiry'} 
                    dir={dir} 
                  />
                  
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                      {t('contact.message') || (isArabic ? 'الرسالة' : 'Message')}
                    </label>
                    <textarea 
                      name="message" 
                      rows="4" 
                      value={formData.message} 
                      onChange={handleChange}
                      required
                      placeholder={isArabic ? 'كيف يمكننا مساعدتك؟' : 'Tell us about your project...'}
                      dir={dir}
                      className={`w-full bg-slate-900/50 border border-white/10 rounded-xl md:rounded-2xl px-4 md:px-6 py-3 md:py-4 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 focus:bg-slate-900/80 transition-all resize-none focus:ring-4 focus:ring-cyan-500/10 text-sm md:text-base ${dir === 'rtl' ? 'text-right' : 'text-left'}`}
                    />
                  </div>

                  {/* زر الإرسال */}
                  <button 
                    type="submit" 
                    disabled={status === 'loading'}
                    className="w-full py-3 md:py-4 lg:py-5 rounded-xl md:rounded-2xl bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 text-black font-bold text-base md:text-lg hover:shadow-[0_8px_40px_rgba(59,130,246,0.25)] transition-transform transform hover:-translate-y-0.5 flex items-center justify-center gap-2 md:gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {status === 'loading' ? (
                      <><ImSpinner8 className="animate-spin text-lg md:text-xl" /> <span className="text-sm md:text-base">{t('loading') || (isArabic ? 'جاري الإرسال (قد يأخذ وقتاً)...' : 'Sending (please wait)...')}</span></>
                    ) : (
                      <><FaPaperPlane className="text-lg md:text-xl" /> <span className="text-sm md:text-base">{t('contact.send') || (isArabic ? 'إرسال الرسالة' : 'Send Message')}</span></>
                    )}
                  </button>

                  {/* رسائل الحالة */}
                  <div ref={messageRef}>
                    {status === 'success' && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-3 md:p-4 rounded-lg md:rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-start gap-2 md:gap-3 text-sm md:text-base">
                        <FaCheck className="flex-shrink-0 mt-0.5" /> <span>{statusMessage || t('contact.sent') || (isArabic ? 'تم الإرسال بنجاح!' : 'Message sent successfully!')}</span>
                      </motion.div>
                    )}
                    {status === 'error' && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-3 md:p-4 rounded-lg md:rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-start gap-2 md:gap-3 text-sm md:text-base">
                        <FaTimes className="flex-shrink-0 mt-0.5" /> <span>{statusMessage || t('contact.failed') || (isArabic ? 'فشل الإرسال، حاول لاحقاً.' : 'Failed to send message.')}</span>
                      </motion.div>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  )
}

// === المكونات الفرعية (Sub-Components) ===

function InputGroup({ label, name, type = "text", value, onChange, required, placeholder, dir }) {
  return (
    <div className="space-y-2 md:space-y-3">
      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 block">
        {label}
      </label>
      <input 
        type={type} 
        name={name} 
        value={value} 
        onChange={onChange} 
        required={required}
        placeholder={placeholder}
        dir={dir}
        className={`w-full bg-slate-900/50 border border-white/10 rounded-xl md:rounded-2xl px-4 md:px-6 py-3 md:py-4 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 focus:bg-slate-900/80 transition-all focus:ring-4 focus:ring-cyan-500/10 text-sm md:text-base ${dir === 'rtl' ? 'text-right' : 'text-left'}`}
      />
    </div>
  )
}

function ContactCard({ icon, title, value, link, color, bg, border, index, onHover, hoveredCard }) {
  const isHovered = hoveredCard === index
  return (
    <motion.a 
      href={link || '#'}
      onMouseEnter={() => onHover(index)}
      onMouseLeave={() => onHover(null)}
      className={`flex items-center gap-4 md:gap-6 p-4 md:p-6 rounded-2xl md:rounded-3xl bg-[#0A0A0A] border border-white/5 transition-all duration-300 group ${border} hover:bg-[#0f121a]`}
    >
      <div className={`w-12 md:w-16 h-12 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center text-xl md:text-2xl transition-all duration-300 ${isHovered ? 'scale-110 shadow-lg' : ''} ${bg} ${color} flex-shrink-0`}>
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">{title}</div>
        <div className="text-base md:text-lg font-bold text-slate-200 group-hover:text-white transition-colors break-words" dir="ltr">{value}</div>
      </div>
    </motion.a>
  )
}

function SocialBtn({ icon, link, color }) {
  return (
    <a href={link} target="_blank" rel="noreferrer" className={`text-xl md:text-2xl text-slate-500 transition-all transform hover:scale-110 ${color}`}>
      {icon}
    </a>
  )
}