import React from 'react'

export default function ConfirmDialog({ open, title = 'Confirm', message = 'Are you sure?', onConfirm, onCancel }){
  if(!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel}></div>
      <div className="bg-slate-800 text-text rounded shadow-lg p-6 z-10 w-full max-w-sm">
        <h4 className="font-semibold mb-2">{title}</h4>
        <p className="mb-4 text-sm text-text/70">{message}</p>
        <div className="flex justify-end gap-2">
          <button className="px-3 py-1 border rounded" onClick={onCancel}>Cancel</button>
          <button className="px-3 py-1 bg-red-600 text-black rounded" onClick={onConfirm}>Yes, delete</button>
        </div>
      </div>
    </div>
  )
}
