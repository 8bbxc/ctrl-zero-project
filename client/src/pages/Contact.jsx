import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaPaperPlane, FaWhatsapp, FaLinkedinIn, FaGithub, FaCheck, FaTimes } from 'react-icons/fa'
import { ImSpinner8 } from 'react-icons/im'
import api from '../services/api'

export default function Contact() {
  const { t, i18n } = useTranslation()
  const dir = i18n.dir()
  const isArabic = i18n.language === 'ar'

  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    subject: '', 
    message: '' 
  })
  const [status, setStatus] = useState('idle') // idle, loading, success, error
  const [hoveredCard, setHoveredCard] = useState(null)

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')

    try {
      const res = await api.post('/contact', formData)

      if (res && (res.status === 201 || res.status === 200)) {
        setStatus('success')
        setFormData({ name: '', email: '', subject: '', message: '' })
        setTimeout(() => setStatus('idle'), 4000)
      } else {
        setStatus('error')
        setTimeout(() => setStatus('idle'), 3000)
      }
    } catch (err) {
      console.error('Contact submit failed:', err?.message || err)
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <div className={`py-12 sm:py-16 lg:py-24 relative bg-slate-950 text-slate-50 font-sans selection:bg-accent selection:text-black ${dir}`}>
      
      {/* === ANIMATED BACKGROUND WITH MULTIPLE LAYERS === */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-50">
        {/* Base gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" />
        
        {/* Animated gradient orbs - Top left (Blue) */}
        <motion.div 
          animate={{ 
            x: [0, 30, -20, 0],
            y: [0, -40, 30, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-10 left-10 lg:top-20 lg:left-20 w-72 sm:w-96 lg:w-[500px] h-72 sm:h-96 lg:h-[500px] bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 rounded-full blur-[100px] sm:blur-[120px] opacity-15 lg:opacity-20"
        />
        
        {/* Animated gradient orbs - Bottom right (Purple/Pink) */}
        <motion.div 
          animate={{ 
            x: [0, -40, 25, 0],
            y: [0, 30, -35, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-20 right-10 lg:bottom-40 lg:right-20 w-72 sm:w-96 lg:w-[500px] h-72 sm:h-96 lg:h-[500px] bg-gradient-to-l from-purple-600 via-pink-500 to-purple-500 rounded-full blur-[100px] sm:blur-[120px] opacity-15 lg:opacity-20"
        />
        
        {/* Animated gradient orbs - Center (Cyan) */}
        <motion.div 
          animate={{ 
            x: [0, 25, -30, 0],
            y: [0, 25, 40, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 sm:w-80 lg:w-96 h-60 sm:h-80 lg:h-96 bg-gradient-to-t from-cyan-500 via-blue-500 to-cyan-500 rounded-full blur-[90px] sm:blur-[110px] opacity-10 lg:opacity-15"
        />

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.03)_1px,transparent_1px)] bg-[size:50px_50px] lg:bg-[size:80px_80px] opacity-40" />
        
        {/* Radial gradient vignette for depth */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-slate-950/50" />
      </div>

      {/* === MAIN CONTENT === */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header section */}
        <motion.div 
          initial={{ opacity: 0, y: -30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-center mb-12 sm:mb-16 lg:mb-20"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-white mb-4 sm:mb-6 leading-tight">
            {t('contact.title') || 'Get in Touch'}
            <motion.span 
              animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.2, 1] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 ml-2 sm:ml-4"
            >
              ✨
            </motion.span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto px-2">
            {t('contact.subtitle') || "Have a project in mind? We would love to hear from you. Let's build something amazing together."}
          </p>
        </motion.div>

        <div className={`grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-start`}>

          {/* === LEFT SIDE: CONTACT INFORMATION === */}
          <motion.div 
            initial={{ opacity: 0, x: dir === 'rtl' ? 30 : -30 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.7, delay: 0.2 }}
            className="space-y-8 sm:space-y-10 order-2 lg:order-1"
          >
            {/* Contact cards with better spacing and animations */}
            <motion.div 
              className="space-y-4 sm:space-y-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants}>
                <ContactCard 
                  icon={<FaEnvelope className="text-lg sm:text-2xl" />} 
                  title={t('contact.email') || 'Email'} 
                  value="yazanbusiness124@gmail.com" 
                  link="mailto:yazanbusiness124@gmail.com"
                  color="from-blue-500 to-cyan-500"
                  index={0}
                  onHover={setHoveredCard}
                  hoveredCard={hoveredCard}
                />
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <ContactCard 
                  icon={<FaPhoneAlt className="text-lg sm:text-2xl" />} 
                  title={t('contact.phone') || 'Phone'} 
                  value="+970 568 203 031" 
                  link="tel:+970568203031"
                  color="from-green-500 to-emerald-500"
                  index={1}
                  onHover={setHoveredCard}
                  hoveredCard={hoveredCard}
                />
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <ContactCard 
                  icon={<FaMapMarkerAlt className="text-lg sm:text-2xl" />} 
                  title={t('contact.location') || 'Location'} 
                  value={isArabic ? 'فلسطين، نابلس' : 'Nablus, Palestine'}
                  color="from-red-500 to-pink-500"
                  index={2}
                  onHover={setHoveredCard}
                  hoveredCard={hoveredCard}
                />
              </motion.div>
            </motion.div>

            {/* Social media section with divider */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="pt-6 sm:pt-10 border-t border-white/10"
            >
              <h3 className="text-white font-bold mb-4 sm:mb-6 uppercase tracking-widest text-xs sm:text-sm">
                {t('contact.social') || 'Follow Us'}
              </h3>
              <div className={`flex gap-4 sm:gap-5 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                 <SocialBtn 
                   icon={<FaWhatsapp className="text-lg sm:text-xl" />} 
                   link="https://wa.me/qr/ZEUXAVWSSI44K1" 
                   color="from-green-500 to-emerald-500"
                   label="WhatsApp"
                 />
                 <SocialBtn 
                   icon={<FaLinkedinIn className="text-lg sm:text-xl" />} 
                   link="https://www.linkedin.com/in/yazan-saadeh/" 
                   color="from-blue-600 to-blue-400"
                   label="LinkedIn"
                 />
                 <SocialBtn 
                   icon={<FaGithub className="text-lg sm:text-xl" />} 
                   link="https://github.com/8bbxc" 
                   color="from-gray-600 to-gray-400"
                   label="GitHub"
                 />
              </div>
            </motion.div>
          </motion.div>

          {/* === RIGHT SIDE: CONTACT FORM === */}
          <motion.div 
            initial={{ opacity: 0, x: dir === 'rtl' ? -30 : 30 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.7, delay: 0.3 }}
            className="order-1 lg:order-2"
          >
            <div className="relative group">
              {/* Animated gradient border effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-500" />
              
              {/* Form container */}
              <div className="relative bg-slate-900/70 backdrop-blur-2xl border border-white/10 p-6 sm:p-8 lg:p-10 rounded-3xl shadow-2xl">
                {/* Decorative light accent */}
                <div className="absolute -top-12 -right-12 w-28 h-28 bg-gradient-to-br from-accent/30 to-transparent rounded-full blur-3xl pointer-events-none opacity-50" />
                <div className="absolute -bottom-12 -left-12 w-28 h-28 bg-gradient-to-tr from-purple-500/20 to-transparent rounded-full blur-3xl pointer-events-none opacity-50" />

                <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6 relative z-10">
                  {/* Name and Email row */}
                  <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6`}>
                    <InputGroup 
                      label={t('contact.name') || 'Name'} 
                      name="name" 
                      value={formData.name} 
                      onChange={handleChange} 
                      required 
                      placeholder={isArabic ? 'اسمك الكامل' : 'Full Name'} 
                      dir={dir}
                    />
                    <InputGroup 
                      label={t('contact.email') || 'Email'} 
                      name="email" 
                      type="email" 
                      value={formData.email} 
                      onChange={handleChange} 
                      required 
                      placeholder={isArabic ? 'بريدك@example.com' : 'your@email.com'}
                      dir={dir}
                    />
                  </div>

                  {/* Subject */}
                  <InputGroup 
                    label={t('contact.subject') || 'Subject'} 
                    name="subject" 
                    value={formData.subject} 
                    onChange={handleChange} 
                    required 
                    placeholder={isArabic ? 'موضوع المشروع' : 'Project Inquiry'}
                    dir={dir}
                  />
                  
                  {/* Message textarea */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                      {t('contact.message') || 'Message'}
                    </label>
                    <textarea 
                      name="message" 
                      rows="5" 
                      value={formData.message} 
                      onChange={handleChange}
                      required
                      placeholder={isArabic ? 'حدثنا عن مشروعك...' : 'Tell us about your project...'}
                      dir={dir}
                      className={`w-full bg-white/5 backdrop-blur border border-white/10 rounded-2xl px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:bg-white/10 transition-all resize-none focus:ring-2 focus:ring-cyan-500/30 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}
                    />
                  </div>

                  {/* Submit button */}
                  <motion.button 
                    type="submit" 
                    disabled={status === 'loading'}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 sm:py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 text-black font-bold text-base sm:text-lg hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-none flex items-center justify-center gap-3 uppercase tracking-wide"
                  >
                    {status === 'loading' ? (
                      <>
                        <ImSpinner8 className="animate-spin text-base sm:text-lg" /> 
                        <span className="text-sm sm:text-base">{t('loading') || 'Sending...'}</span>
                      </>
                    ) : (
                      <>
                        <FaPaperPlane className="text-base sm:text-lg" /> 
                        <span className="text-sm sm:text-base">{t('contact.send') || 'Send Message'}</span>
                      </>
                    )}
                  </motion.button>

                  {/* Status messages with animations */}
                  {status === 'success' && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }} 
                      animate={{ opacity: 1, y: 0, scale: 1 }} 
                      exit={{ opacity: 0, y: -10 }}
                      className="p-4 sm:p-5 bg-gradient-to-r from-emerald-500/10 via-green-500/10 to-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center gap-3"
                    >
                      <FaCheck className="text-emerald-400 flex-shrink-0 text-lg" />
                      <p className="text-emerald-400 text-center sm:text-left font-semibold text-sm sm:text-base">
                        {t('contact.sent') || 'Message sent successfully! We will contact you soon.'}
                      </p>
                    </motion.div>
                  )}

                  {status === 'error' && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }} 
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-4 sm:p-5 bg-gradient-to-r from-red-500/10 via-red-500/10 to-red-500/10 border border-red-500/30 rounded-2xl flex items-center gap-3"
                    >
                      <FaTimes className="text-red-400 flex-shrink-0 text-lg" />
                      <p className="text-red-400 text-center sm:text-left font-semibold text-sm sm:text-base">
                        {t('contact.failed') || 'Failed to send message. Please try again later.'}
                      </p>
                    </motion.div>
                  )}
                </form>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  )
}

// === COMPONENT: Input Group ===
function InputGroup({ label, name, type = "text", value, onChange, required, placeholder, dir }) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
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
        className={`w-full bg-white/5 backdrop-blur border border-white/10 rounded-2xl px-4 sm:px-6 py-3 sm:py-3.5 text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:bg-white/10 transition-all focus:ring-2 focus:ring-cyan-500/30 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}
      />
    </div>
  )
}

// === COMPONENT: Contact Card ===
function ContactCard({ icon, title, value, link, color, index, onHover, hoveredCard }) {
  const isHovered = hoveredCard === index
  
  return (
    <motion.a 
      href={link || '#'}
      onMouseEnter={() => onHover(index)}
      onMouseLeave={() => onHover(null)}
      whileHover={{ y: -8 }}
      className={`flex items-center gap-4 sm:gap-5 p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-900/50 to-slate-800/30 border border-white/10 hover:border-white/20 transition-all group cursor-pointer backdrop-blur-sm ${!link ? 'hover:cursor-default' : 'hover:shadow-[0_10px_40px_rgba(59,130,246,0.2)]'}`}
    >
      <motion.div 
        animate={{
          scale: isHovered ? 1.15 : 1,
          rotate: isHovered ? 10 : 0,
        }}
        transition={{ duration: 0.3 }}
        className={`w-14 sm:w-16 h-14 sm:h-16 flex-shrink-0 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white shadow-lg group-hover:shadow-[0_0_30px_rgba(59,130,246,0.4)]`}
      >
        {icon}
      </motion.div>
      
      <div className="flex-1 min-w-0">
        <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1 sm:mb-2">{title}</div>
        <div className={`text-white font-semibold text-sm sm:text-lg group-hover:text-cyan-400 transition-colors break-words`}>
          {value}
        </div>
      </div>
      
      <motion.div 
        animate={{ x: isHovered ? 8 : 0 }}
        transition={{ duration: 0.3 }}
        className="text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 text-xl sm:text-2xl hidden sm:block"
      >
        →
      </motion.div>
    </motion.a>
  )
}

// === COMPONENT: Social Button ===
function SocialBtn({ icon, link, color, label }) {
  return (
    <motion.a 
      href={link} 
      target="_blank" 
      rel="noreferrer"
      whileHover={{ scale: 1.15, y: -5 }}
      whileTap={{ scale: 0.95 }}
      title={label}
      className={`w-12 sm:w-14 h-12 sm:h-14 rounded-full border border-white/20 bg-gradient-to-br ${color} flex items-center justify-center text-white transition-all hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] relative group`}
    >
      <span className="text-lg sm:text-xl">{icon}</span>
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        whileHover={{ opacity: 1, y: 0 }}
        className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900/90 text-white text-xs font-bold px-3 py-2 rounded-lg whitespace-nowrap backdrop-blur border border-white/10 pointer-events-none"
      >
        {label}
      </motion.div>
    </motion.a>
  )
}