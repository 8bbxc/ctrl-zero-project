import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Carousel({ images = [] }){
  const [index, setIndex] = useState(0)
  const [lightbox, setLightbox] = useState({ open: false, idx: 0 })
  if(!images || images.length === 0) return null

  function onDragEnd(event, info){
    const offset = info.offset.x
    if (offset < -80) setIndex(i => Math.min(i+1, images.length-1))
    if (offset > 80) setIndex(i => Math.max(i-1, 0))
  }

  useEffect(()=>{
    function onKey(e){ if(e.key === 'Escape') setLightbox({ open:false, idx:0 }) }
    window.addEventListener('keydown', onKey)
    return ()=> window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-lg">
        <motion.div className="flex" drag="x" dragConstraints={{ left: 0, right: 0 }} onDragEnd={onDragEnd} animate={{ x: `-${index * 100}%` }} transition={{ type: 'spring', damping: 20, stiffness: 140 }}>
          {images.map((src, i) => (
            <div key={i} className="min-w-full h-60 md:h-80 bg-center bg-cover cursor-zoom-in" style={{ backgroundImage: `url(${src})` }} onClick={()=>setLightbox({ open:true, idx:i })} />
          ))}
        </motion.div>
      </div>

      {/* Controls */}
      <button onClick={()=>setIndex(i=>Math.max(i-1,0))} aria-label="Previous" className="absolute left-2 top-1/2 -translate-y-1/2 bg-slate-800/70 border border-slate-700 rounded-full p-2">‹</button>
      <button onClick={()=>setIndex(i=>Math.min(i+1, images.length-1))} aria-label="Next" className="absolute right-2 top-1/2 -translate-y-1/2 bg-slate-800/70 border border-slate-700 rounded-full p-2">›</button>

      {/* Dots */}
      <div className="mt-3 flex justify-center gap-2">
        {images.map((_, i) => (
          <button key={i} onClick={()=>setIndex(i)} className={`w-2 h-2 rounded-full ${i===index? 'bg-accent' : 'bg-slate-600'}`} aria-label={`Go to slide ${i+1}`} />
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox.open && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setLightbox({ open:false, idx:0 })}>
            <motion.img src={images[lightbox.idx]} alt="screenshot" className="max-w-[95%] max-h-[95%] rounded-lg shadow-2xl" initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} onClick={(e)=>e.stopPropagation()} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 