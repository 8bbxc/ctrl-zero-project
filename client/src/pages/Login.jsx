import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { FaLock, FaUserShield, FaFingerprint } from 'react-icons/fa'
import { ImSpinner8 } from 'react-icons/im'
import { login } from '../services/auth'

export default function Login() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(formData.email, formData.password)
      navigate('/admin')
    } catch (err) {
      setError('Invalid credentials. Access denied.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 relative overflow-hidden">
      
      {/* خلفية ديناميكية */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[120px] animate-pulse" />
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] rounded-full bg-purple-600/10 blur-[100px] animate-pulse" style={{animationDelay: '2s'}} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-0 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-xl">
          
          {/* الجانب الأيسر: الهوية البصرية */}
          <div className="hidden md:flex flex-col items-center justify-center p-12 bg-gradient-to-br from-slate-900 to-slate-950 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/images/grid.svg')] opacity-10" />
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="relative z-10 text-center"
            >
              <div className="w-24 h-24 mx-auto bg-gradient-to-tr from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(59,130,246,0.3)] mb-6">
                <FaUserShield className="text-4xl text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2 tracking-wide">CTRL ZERO</h2>
              <p className="text-slate-400 text-sm">Secure Admin Gateway</p>
            </motion.div>
          </div>

          {/* الجانب الأيمن: النموذج */}
          <div className="p-10 md:p-12 flex flex-col justify-center">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <FaFingerprint className="text-accent" /> {t('login.title') || 'Authenticate'}
            </h3>

            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }} 
                animate={{ opacity: 1, x: 0 }}
                className="mb-6 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg flex items-center gap-2"
              >
                <FaLock /> {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{t('login.email')}</label>
                <input 
                  type="email" 
                  className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-accent focus:ring-1 focus:ring-accent transition-all outline-none shadow-inner"
                  placeholder="admin@ctrlzero.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{t('login.password')}</label>
                <input 
                  type="password" 
                  className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-accent focus:ring-1 focus:ring-accent transition-all outline-none shadow-inner"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-3.5 mt-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold tracking-wide shadow-lg hover:shadow-blue-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 relative overflow-hidden group"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                {loading ? <ImSpinner8 className="animate-spin" /> : t('login.login')}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  )
}