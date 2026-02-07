import React from 'react'
import { FaWhatsapp } from 'react-icons/fa'

export default function FloatingWhatsApp(){
  return (
    <a href="https://wa.me/qr/ZEUXAVWSSI44K1" target="_blank" rel="noreferrer" className="fixed bottom-6 right-6 z-50 bg-green-500 p-3 rounded-full shadow-lg text-white flex items-center justify-center hover:scale-105 transition">
      <FaWhatsapp />
    </a>
  )
}
