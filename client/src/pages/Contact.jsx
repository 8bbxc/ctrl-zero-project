import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { 
  FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaPaperPlane, 
  FaWhatsapp, FaLinkedinIn, FaGithub, FaCheck, FaTimes 
} from 'react-icons/fa'
import { ImSpinner8 } from 'react-icons/im'
import api from '../services/api'
import Footer from '../components/Footer' // تأكد من استيراد الفوتر هنا

export default function Contact() {
  const { t, i18n } = useTranslation()
  const dir = i18n.dir()
  const isArabic = i18n.language === 'ar'

  // --- Logic State ---
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    subject: '', 
    message: '' 
  })
  const [status, setStatus] = useState('idle')
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

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <div className={`min-h-screen bg-[#030712] text-slate-50 font-sans selection:bg-cyan-500/30 flex flex-col ${dir}`}>
      
      {/* === 1. Ambient Background (Vibrant) === */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/05 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] mix-blend-overlay" />
      </div>

      {/* === MAIN CONTENT WRAPPER === */}
      <div className="flex-grow pt-32 pb-20 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          
          {/* Header Section */}
          <motion.div 
            initial={{ opacity: 0, y: -30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8 }}
            className="text-center mb-16 lg:mb-24"
          >
            <span className="inline-block py-1 px-3 rounded-full bg-cyan-900/30 border border-cyan-500/30 text-cyan-400 font-mono text-xs uppercase tracking-[0.3em] mb-6 backdrop-blur-md">
              {t('contact.subtitle') || 'CONTACT US'}
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">
              Let's Start a <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500">Conversation.</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
              {t('contact.desc') || "Have a project in mind? We would love to hear from you. Let's build something amazing together."}
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">

            {/* === LEFT SIDE: Info Cards === */}
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6 order-2 lg:order-1"
            >
              <motion.div variants={itemVariants}>
                <ContactCard 
                  icon={<FaEnvelope />} 
                  title={t('contact.email') || 'Email'} 
                  value="yazanbusiness124@gmail.com" 
                  link="mailto:yazanbusiness124@gmail.com"
                  color="text-cyan-400"
                  bg="bg-cyan-500/10"
                  borderColor="group-hover:border-cyan-500/50"
                  index={0} onHover={setHoveredCard} hoveredCard={hoveredCard}
                />
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <ContactCard 
                  icon={<FaPhoneAlt />} 
                  title={t('contact.phone') || 'Phone'} 
                  value="+970 568 203 031" 
                  link="tel:+970568203031"
                  color="text-emerald-400"
                  bg="bg-emerald-500/10"
                  borderColor="group-hover:border-emerald-500/50"
                  index={1} onHover={setHoveredCard} hoveredCard={hoveredCard}
                />
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <ContactCard 
                  icon={<FaMapMarkerAlt />} 
                  title={t('contact.location') || 'Location'} 
                  value={isArabic ? 'فلسطين، نابلس' : 'Nablus, Palestine'}
                  color="text-purple-400"
                  bg="bg-purple-500/10"
                  borderColor="group-hover:border-purple-500/50"
                  index={2} onHover={setHoveredCard} hoveredCard={hoveredCard}
                />
              </motion.div>

              {/* Social Media */}
              <motion.div variants={itemVariants} className="pt-10 border-t border-white/5">
                <h3 className="text-slate-400 font-mono text-xs uppercase tracking-[0.2em] mb-6">
                  {t('contact.social') || 'Follow Us'}
                </h3>
                <div className="flex gap-5">
                   <SocialBtn icon={<FaWhatsapp />} link="https://wa.me/qr/ZEUXAVWSSI44K1" color="from-green-500 to-emerald-600" />
                   <SocialBtn icon={<FaLinkedinIn />} link="https://www.linkedin.com/in/yazan-saadeh/" color="from-blue-600 to-cyan-500" />
                   <SocialBtn icon={<FaGithub />} link="https://github.com/8bbxc" color="from-slate-700 to-slate-600" />
                </div>
              </motion.div>
            </motion.div>

            {/* === RIGHT SIDE: The Form (Premium Glass) === */}
            <motion.div 
              initial={{ opacity: 0, x: dir === 'rtl' ? -50 : 50 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ duration: 0.8, delay: 0.2 }}
              className="order-1 lg:order-2"
            >
              <div className="relative group">
                {/* Glow Border Effect behind form */}
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-[2rem] blur opacity-25 group-hover:opacity-50 transition duration-1000" />
                
                <div className="relative bg-[#0f1420]/80 backdrop-blur-xl border border-white/10 p-8 sm:p-10 rounded-[2rem] shadow-2xl">
                  
                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-[60px] pointer-events-none" />

                  <h3 className="text-2xl font-bold text-white mb-8">{t('contact.formTitle') || 'Send us a message'}</h3>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <InputGroup label={t('contact.name') || 'Name'} name="name" value={formData.name} onChange={handleChange} required placeholder={isArabic ? 'اسمك' : 'Your Name'} dir={dir} />
                      <InputGroup label={t('contact.email') || 'Email'} name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="name@example.com" dir={dir} />
                    </div>

                    <InputGroup label={t('contact.subject') || 'Subject'} name="subject" value={formData.subject} onChange={handleChange} required placeholder={isArabic ? 'عنوان الرسالة' : 'Project Inquiry'} dir={dir} />
                    
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                        {t('contact.message') || 'Message'}
                      </label>
                      <textarea 
                        name="message" 
                        rows="5" 
                        value={formData.message} 
                        onChange={handleChange}
                        required
                        placeholder={isArabic ? 'كيف يمكننا مساعدتك؟' : 'Tell us about your project...'}
                        dir={dir}
                        className={`w-full bg-[#1a202e] border border-white/5 rounded-xl px-5 py-4 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:bg-[#1f293a] transition-all resize-none focus:ring-1 focus:ring-cyan-500/50 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}
                      />
                    </div>

                    {/* Submit Button */}
                    <button 
                      type="submit" 
                      disabled={status === 'loading'}
                      className="w-full py-4 rounded-xl bg-white text-black font-bold text-lg hover:bg-cyan-50 transition-all flex items-center justify-center gap-3 shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_-5px_rgba(6,182,212,0.5)] transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                    >
                      {status === 'loading' ? (
                        <><ImSpinner8 className="animate-spin text-xl" /> <span>{t('loading') || 'Processing...'}</span></>
                      ) : (
                        <><FaPaperPlane className="text-lg" /> <span>{t('contact.send') || 'Send Message'}</span></>
                      )}
                    </button>

                    {/* Status Messages */}
                    {status === 'success' && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-3 text-sm font-medium">
                        <FaCheck /> <span>{t('contact.sent') || 'Message sent successfully!'}</span>
                      </motion.div>
                    )}
                    {status === 'error' && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-3 text-sm font-medium">
                        <FaTimes /> <span>{t('contact.failed') || 'Failed to send message.'}</span>
                      </motion.div>
                    )}
                  </form>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>

      {/* === FOOTER (Added at the bottom) === */}
      <Footer />
    </div>
  )
}

// === Sub-Components ===

function InputGroup({ label, name, type = "text", value, onChange, required, placeholder, dir }) {
  return (
    <div className="space-y-2">
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
        className={`w-full bg-[#1a202e] border border-white/5 rounded-xl px-5 py-4 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:bg-[#1f293a] transition-all focus:ring-1 focus:ring-cyan-500/50 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}
      />
    </div>
  )
}

function ContactCard({ icon, title, value, link, color, bg, borderColor, index, onHover, hoveredCard }) {
  const isHovered = hoveredCard === index
  return (
    <motion.a 
      href={link || '#'}
      onMouseEnter={() => onHover(index)}
      onMouseLeave={() => onHover(null)}
      className={`flex items-center gap-6 p-6 rounded-2xl bg-[#0f1420] border border-white/5 transition-all duration-300 group ${borderColor} hover:bg-[#151b29] hover:shadow-lg`}
    >
      <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl transition-all duration-300 ${isHovered ? 'scale-110 shadow-lg' : ''} ${bg} ${color}`}>
        {icon}
      </div>
      <div>
        <div className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">{title}</div>
        <div className="text-lg font-bold text-slate-200 group-hover:text-white transition-colors">{value}</div>
      </div>
    </motion.a>
  )
}

function SocialBtn({ icon, link, color }) {
  return (
    <a 
      href={link} 
      target="_blank" 
      rel="noreferrer" 
      className={`w-12 h-12 rounded-full bg-[#0f1420] border border-white/10 flex items-center justify-center text-xl text-slate-400 transition-all hover:scale-110 hover:text-white bg-gradient-to-br hover:${color} hover:border-transparent hover:shadow-lg`}
    >
      {icon}
    </a>
  )
}