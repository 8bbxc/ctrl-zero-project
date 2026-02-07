import React from 'react'
import { motion } from 'framer-motion'

export default function Loader() {
  // إعدادات حركة الحلقات
  const spinTransition = {
    repeat: Infinity,
    ease: "linear",
    duration: 8 // مدة الدورة الكاملة للحلقة الخارجية
  }

  const reverseSpinTransition = {
    ...spinTransition,
    duration: 5, // الحلقة الداخلية أسرع وعكس الاتجاه
    repeatType: "reverse"
  }

  return (
    // حاوية الشاشة الكاملة مع خلفية ضبابية داكنة
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-950/90 backdrop-blur-md"
    >
      <div className="relative w-32 h-32 flex items-center justify-center">
        
        {/* 1. النواة المركزية النابضة (The Core) */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7],
            boxShadow: [
              "0 0 20px rgba(59, 130, 246, 0.5)",
              "0 0 40px rgba(168, 85, 247, 0.8)",
              "0 0 20px rgba(59, 130, 246, 0.5)"
            ]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute w-8 h-8 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full z-20"
        />

        {/* 2. الحلقة الداخلية الدوارة (Inner Ring) */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={reverseSpinTransition}
          className="absolute w-20 h-20 rounded-full border-2 border-t-blue-500 border-r-transparent border-b-purple-500 border-l-transparent z-10"
        />

        {/* 3. الحلقة الخارجية الدوارة (Outer Ring) */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={spinTransition}
          className="absolute w-32 h-32 rounded-full border-[1px] border-slate-700/50 border-t-accent/80 border-b-accent/30"
        />

        {/* 4. الماسح الضوئي السريع (The Scanner Particle) */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute w-full h-full"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-accent rounded-full shadow-[0_0_15px_rgba(59,130,246,1)]"></div>
        </motion.div>

        {/* تأثير توهج خلفي عام */}
        <div className="absolute inset-0 bg-blue-600/20 rounded-full blur-[80px] -z-10 animate-pulse" />
        
      </div>

      {/* نص التحميل مع تأثير وميض */}
      <motion.p 
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
        className="mt-8 text-accent font-mono text-sm tracking-[0.2em] uppercase"
      >
        Initializing System...
      </motion.p>
    </motion.div>
  )
}