import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FaGithub, FaLinkedin, FaInstagram, FaWhatsapp, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaHeart } from 'react-icons/fa'

export default function Footer() {
  const { t, i18n } = useTranslation()
  const dir = i18n.dir()
  const isArabic = i18n.language === 'ar'

  const currentYear = new Date().getFullYear()

  return (
    <footer className={`relative bg-slate-950 pt-0 overflow-hidden ${dir}`}>
      
      {/* 1. Top Gradient Border (Neon Line) */}
      <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 shadow-[0_0_20px_rgba(59,130,246,0.5)]" />

      {/* 2. Background Decor */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-900/10 rounded-full blur-[100px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-900/10 rounded-full blur-[100px] -z-10 pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-6 sm:pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12 mb-12 sm:mb-16">
          
          {/* Column 1: Brand Info */}
          <div className="space-y-4 sm:space-y-6">
            <Link to="/" className="inline-block hover:opacity-80 transition-opacity">
              <img 
                src="/images/navLogo/logo.png" 
                alt="CTRL ZERO" 
                className="h-12 sm:h-14 lg:h-16 w-auto object-contain brightness-110" 
              />
            </Link>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-xs">
              {t('hero.subtitle') || 'Premium software agency specializing in product engineering, scalable platforms, and polished UX.'}
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-white font-bold text-base sm:text-lg mb-4 sm:mb-6 relative inline-block">
              {t('footer.links') || 'Quick Links'}
              <span className={`absolute -bottom-2 ${dir === 'rtl' ? 'right-0' : 'left-0'} w-1/2 h-0.5 bg-accent rounded-full`}></span>
            </h4>
            <ul className="space-y-2 sm:space-y-3">
              <FooterLink to="/" text={t('nav.home')} />
              <FooterLink to="/projects" text={t('nav.projects')} />
              <FooterLink to="/services" text={t('nav.services')} />
              <FooterLink to="/about" text={t('nav.about')} />
              <FooterLink to="/contact" text={t('nav.contact')} />
            </ul>
          </div>

          {/* Column 3: Services */}
          <div>
            <h4 className="text-white font-bold text-base sm:text-lg mb-4 sm:mb-6 relative inline-block">
              {t('nav.services') || 'Services'}
              <span className={`absolute -bottom-2 ${dir === 'rtl' ? 'right-0' : 'left-0'} w-1/2 h-0.5 bg-purple-500 rounded-full`}></span>
            </h4>
            <ul className="space-y-2 sm:space-y-3">
              <li className="text-slate-400 text-xs sm:text-sm hover:text-white transition-colors cursor-default">{isArabic ? 'تطوير Full-Stack' : 'Full-Stack Development'}</li>
              <li className="text-slate-400 text-xs sm:text-sm hover:text-white transition-colors cursor-default">{isArabic ? 'تصميم UI/UX' : 'UI/UX Design'}</li>
              <li className="text-slate-400 text-xs sm:text-sm hover:text-white transition-colors cursor-default">{isArabic ? 'تطبيقات الموبايل' : 'Mobile Apps'}</li>
              <li className="text-slate-400 text-xs sm:text-sm hover:text-white transition-colors cursor-default">{isArabic ? 'الحلول السحابية' : 'Cloud Solutions'}</li>
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div>
            <h4 className="text-white font-bold text-base sm:text-lg mb-4 sm:mb-6 relative inline-block">
              {t('nav.contact') || 'Contact'}
              <span className={`absolute -bottom-2 ${dir === 'rtl' ? 'right-0' : 'left-0'} w-1/2 h-0.5 bg-pink-500 rounded-full`}></span>
            </h4>
            <ul className="space-y-3 sm:space-y-4">
              <li className={`flex items-start gap-2 sm:gap-3 text-slate-400 text-xs sm:text-sm group ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                <FaEnvelope className="text-accent mt-0.5 sm:mt-1 text-base sm:text-lg flex-shrink-0 group-hover:scale-110 transition-transform" />
                <span className="group-hover:text-white transition-colors break-word">yazanbusiness124@gmail.com</span>
              </li>
              <li className={`flex items-start gap-2 sm:gap-3 text-slate-400 text-xs sm:text-sm group ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                <FaPhoneAlt className="text-accent mt-0.5 sm:mt-1 text-base sm:text-lg flex-shrink-0 group-hover:scale-110 transition-transform" />
                <a href="tel:+970568203031" className="group-hover:text-white transition-colors">+970 568 203 031</a>
              </li>
              <li className={`flex items-start gap-2 sm:gap-3 text-slate-400 text-xs sm:text-sm group ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                <FaMapMarkerAlt className="text-accent mt-0.5 sm:mt-1 text-base sm:text-lg flex-shrink-0 group-hover:scale-110 transition-transform" />
                <span className="group-hover:text-white transition-colors">{isArabic ? 'نابلس، فلسطين' : 'Nablus, Palestine'}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-800 to-transparent mb-6 sm:mb-8" />

        {/* Bottom Bar */}
        <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6`}>
          
          {/* Copyright */}
          <div className="text-slate-500 text-xs sm:text-sm text-center">
            &copy; {currentYear} <span className="text-slate-300 font-semibold">CTRL ZERO</span>. {t('footer.rights') || 'All rights reserved.'}
          </div>

          {/* Social Icons */}
          <div className={`flex items-center gap-3 sm:gap-4 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
            <SocialIcon 
              href="https://www.instagram.com/eng.yazan46" 
              icon={<FaInstagram />} 
              color="hover:text-pink-500 hover:bg-pink-500/10 hover:border-pink-500/50" 
              title="Instagram"
            />
            <SocialIcon 
              href="https://github.com/8bbxc" 
              icon={<FaGithub />} 
              color="hover:text-white hover:bg-white/10 hover:border-white/50" 
              title="GitHub"
            />
            <SocialIcon 
              href="https://wa.me/qr/ZEUXAVWSSI44K1" 
              icon={<FaWhatsapp />} 
              color="hover:text-green-500 hover:bg-green-500/10 hover:border-green-500/50" 
              title="WhatsApp"
            />
            <SocialIcon 
              href="https://www.linkedin.com/in/yazan-saadeh/" 
              icon={<FaLinkedin />} 
              color="hover:text-blue-500 hover:bg-blue-500/10 hover:border-blue-500/50" 
              title="LinkedIn"
            />
          </div>
        </div>

        {/* Made with Love tag */}
        <div className="mt-6 sm:mt-8 text-center">
           <p className="text-xs text-slate-600 flex items-center justify-center gap-1 flex-wrap">
             {isArabic ? 'تم التصميم والبناء بواسطة' : 'Designed & Built by'} <span className="text-slate-400 font-bold">Eng. Yazan Saadeh</span>
           </p>
        </div>

      </div>
    </footer>
  )
}

// Helper Components for cleaner code

function FooterLink({ to, text }) {
  const { i18n } = useTranslation()
  const dir = i18n.dir()
  
  return (
    <li>
      <Link 
        to={to} 
        className={`text-slate-400 text-xs sm:text-sm hover:text-accent transition-all duration-300 inline-block ${dir === 'rtl' ? 'hover:-translate-x-1' : 'hover:translate-x-1'}`}
      >
        {text}
      </Link>
    </li>
  )
}

function SocialIcon({ href, icon, color, title }) {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noreferrer"
      title={title}
      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-slate-700 bg-slate-900 flex items-center justify-center text-slate-400 transition-all duration-300 ${color} hover:scale-110`}
    >
      <span className="text-base sm:text-xl">{icon}</span>
    </a>
  )
}