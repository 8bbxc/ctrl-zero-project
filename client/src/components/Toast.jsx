import React from 'react'

export default function Toast({ toasts = [], onClose }){
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map(t => (
        <div key={t.id} className={`max-w-xs rounded-md px-4 py-2 shadow-lg text-sm ${t.type === 'success' ? 'bg-green-500 text-black' : 'bg-red-600 text-white'}`}>
          <div className="flex items-center justify-between gap-4">
            <div>{t.message}</div>
            <button onClick={()=>onClose && onClose(t.id)} className="text-xs opacity-80">✕</button>
          </div>
        </div>
      ))}
    </div>
  )
}
