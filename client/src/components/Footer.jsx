import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FaGithub, FaLinkedin, FaInstagram, FaWhatsapp, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaHeart } from 'react-icons/fa'

export default function Footer() {
  const { t, i18n } = useTranslation()
  const dir = i18n.dir()

  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative bg-slate-950 pt-0 overflow-hidden">
      
      {/* 1. Top Gradient Border (Neon Line) */}
      <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 shadow-[0_0_20px_rgba(59,130,246,0.5)]" />

      {/* 2. Background Decor */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-900/10 rounded-full blur-[100px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-900/10 rounded-full blur-[100px] -z-10 pointer-events-none" />

      <div className="container mx-auto px-6 md:px-12 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Column 1: Brand Info */}
          <div className="space-y-6">
            <Link to="/" className="inline-block">
              <img 
                src="/images/navLogo/logo.png" 
                alt="CTRL ZERO" 
                className="h-14 md:h-16 w-auto object-contain brightness-110" 
              />
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              {t('hero.subtitle') || 'Premium software agency specializing in product engineering, scalable platforms, and polished UX.'}
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6 relative inline-block">
              {t('footer.links') || 'Quick Links'}
              <span className="absolute -bottom-2 left-0 w-1/2 h-0.5 bg-accent rounded-full"></span>
            </h4>
            <ul className="space-y-3">
              <FooterLink to="/" text={t('nav.home')} />
              <FooterLink to="/projects" text={t('nav.projects')} />
              <FooterLink to="/services" text={t('nav.services')} />
              <FooterLink to="/about" text={t('nav.about')} />
              <FooterLink to="/contact" text={t('nav.contact')} />
            </ul>
          </div>

          {/* Column 3: Services */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6 relative inline-block">
              {t('nav.services') || 'Services'}
              <span className="absolute -bottom-2 left-0 w-1/2 h-0.5 bg-purple-500 rounded-full"></span>
            </h4>
            <ul className="space-y-3">
              <li className="text-slate-400 text-sm hover:text-white transition-colors cursor-default">Full-Stack Development</li>
              <li className="text-slate-400 text-sm hover:text-white transition-colors cursor-default">UI/UX Design</li>
              <li className="text-slate-400 text-sm hover:text-white transition-colors cursor-default">Mobile Apps</li>
              <li className="text-slate-400 text-sm hover:text-white transition-colors cursor-default">Cloud Solutions</li>
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6 relative inline-block">
              {t('nav.contact') || 'Contact'}
              <span className="absolute -bottom-2 left-0 w-1/2 h-0.5 bg-pink-500 rounded-full"></span>
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-slate-400 text-sm group">
                <FaEnvelope className="text-accent mt-1 text-lg group-hover:scale-110 transition-transform" />
                <span className="group-hover:text-white transition-colors">yazanbusiness124@gmail.com</span>
              </li>
              <li className="flex items-start gap-3 text-slate-400 text-sm group">
                <FaPhoneAlt className="text-accent mt-1 text-lg group-hover:scale-110 transition-transform" />
                <span className={`group-hover:text-white transition-colors ${dir === 'rtl' ? 'font-sans' : ''}`}>+970 568 203 031</span>
              </li>
              <li className="flex items-start gap-3 text-slate-400 text-sm group">
                <FaMapMarkerAlt className="text-accent mt-1 text-lg group-hover:scale-110 transition-transform" />
                <span className="group-hover:text-white transition-colors">{dir === 'rtl' ? 'نابلس، فلسطين' : 'Nablus, Palestine'}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-800 to-transparent mb-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Copyright */}
          <div className="text-slate-500 text-sm text-center md:text-left">
            &copy; {currentYear} <span className="text-slate-300 font-semibold">CTRL ZERO</span>. {t('footer.rights') || 'All rights reserved.'}
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-4">
            <SocialIcon 
              href="https://www.instagram.com/eng.yazan46" 
              icon={<FaInstagram />} 
              color="hover:text-pink-500 hover:bg-pink-500/10 hover:border-pink-500/50" 
            />
            <SocialIcon 
              href="https://github.com/8bbxc" 
              icon={<FaGithub />} 
              color="hover:text-white hover:bg-white/10 hover:border-white/50" 
            />
            <SocialIcon 
              href="https://wa.me/qr/ZEUXAVWSSI44K1" 
              icon={<FaWhatsapp />} 
              color="hover:text-green-500 hover:bg-green-500/10 hover:border-green-500/50" 
            />
            <SocialIcon 
              href="#" 
              icon={<FaLinkedin />} 
              color="hover:text-blue-500 hover:bg-blue-500/10 hover:border-blue-500/50" 
            />
          </div>
        </div>

        {/* Made with Love tag */}
        <div className="mt-8 text-center">
           <p className="text-xs text-slate-600 flex items-center justify-center gap-1">
             Designed & Built by <span className="text-slate-400 font-bold">Eng. Yazan Saadeh</span>
           </p>
        </div>

      </div>
    </footer>
  )
}

// Helper Components for cleaner code

function FooterLink({ to, text }) {
  return (
    <li>
      <Link 
        to={to} 
        className="text-slate-400 text-sm hover:text-accent hover:translate-x-1 transform transition-all duration-300 inline-block"
      >
        {text}
      </Link>
    </li>
  )
}

function SocialIcon({ href, icon, color }) {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noreferrer"
      className={`w-10 h-10 rounded-full border border-slate-700 bg-slate-900 flex items-center justify-center text-slate-400 transition-all duration-300 ${color} hover:scale-110`}
    >
      <span className="text-xl">{icon}</span>
    </a>
  )
}