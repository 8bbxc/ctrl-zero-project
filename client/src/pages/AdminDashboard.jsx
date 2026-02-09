import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FaProjectDiagram, FaLayerGroup, FaEnvelope, 
  FaPlus, FaTrash, FaEdit, FaSearch, FaTimes, FaCloudUploadAlt, 
  FaImages, FaClock, FaGlobe, FaUser, FaLink, FaTag, FaMagic
} from 'react-icons/fa'
import { logout } from '../services/auth'
import api from '../services/api'
import Toast from '../components/Toast'
import Spinner from '../components/Spinner'
import ConfirmDialog from '../components/ConfirmDialog'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

// --- قائمة التصنيفات (مهمة جداً للربط) ---
const SECTORS = ['Medical', 'E-Commerce', 'Restaurant', 'Corporate', 'Education', 'Real Estate'];
const FALLBACK_SVG = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100'><rect width='100%' height='100%' fill='%231e293b'/><text x='50%' y='50%' fill='%23475569' font-size='12' font-family='Arial' text-anchor='middle' dominant-baseline='middle'>No Image</text></svg>`;

const StatCard = ({ title, count, icon, color, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, type: 'spring' }}
    className="relative overflow-hidden bg-slate-900/60 backdrop-blur-xl border border-white/5 p-4 md:p-6 rounded-2xl group hover:border-white/10 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10"
  >
    <div className={`absolute -top-4 -right-4 p-4 opacity-5 group-hover:opacity-20 transition-opacity ${color} text-8xl rotate-12`}>
      {icon}
    </div>
    <div className="relative z-10">
      <div className={`w-10 h-10 mb-4 rounded-xl flex items-center justify-center bg-white/5 ${color} bg-clip-text text-2xl`}>
        {icon}
      </div>
      <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">{title}</h3>
      <p className="text-3xl font-black text-white tracking-tight">{count}</p>
    </div>
  </motion.div>
)

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('projects') 
  const [items, setItems] = useState([]) 
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [counts, setCounts] = useState({ projects: 0, services: 0, messages: 0 })
  
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [toasts, setToasts] = useState([])
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null })
  
  const [formData, setFormData] = useState({}) 
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/admin/login')
      return
    }
    fetchData()
    fetchCounts()
  }, [activeTab, navigate])

  const fetchCounts = async () => {
    try {
      const [projRes, svcRes, msgRes] = await Promise.all([
        api.get('/projects').catch(() => ({ data: [] })),
        api.get('/services').catch(() => ({ data: [] })),
        api.get('/messages').catch(() => ({ data: [] })),
      ])
      
      const getCount = (res) => {
         if (Array.isArray(res.data)) return res.data.length;
         if (res.data && Array.isArray(res.data.items)) return res.data.items.length;
         return 0;
      }

      setCounts({ 
        projects: getCount(projRes), 
        services: getCount(svcRes), 
        messages: getCount(msgRes) 
      })
    } catch (err) {
      console.error('Failed to fetch counts', err)
    }
  }

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await api.get(`/${activeTab}`)
      if (Array.isArray(res.data)) {
        setItems(res.data)
      } else if (res.data && Array.isArray(res.data.items)) {
        setItems(res.data.items)
      } else {
        setItems([])
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      addToast('error', 'Failed to load data.')
      if (err.response?.status === 401) logout()
      setItems([])
    } finally {
      setLoading(false)
      fetchCounts()
    }
  }

  const addToast = (type, message) => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, type, message }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000)
  }

  // --- تحديث الـ slug تلقائياً عند تغيير الـ Title ---
  useEffect(() => {
    if (activeTab === 'projects' && formData.title && showModal && !editingItem) {
      const newSlug = formData.title.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-_]/g, '')
      if (newSlug !== formData.slug) {
        setFormData(prev => ({ ...prev, slug: newSlug }))
      }
    }
  }, [formData.title, activeTab, showModal, editingItem])

  // --- منطق فتح النافذة (Modal) ---
  const openModal = (item = null) => {
    if (activeTab === 'messages') return; 
    setEditingItem(item)
    
    if (activeTab === 'projects') {
      const tagsValue = item?.tags && Array.isArray(item.tags) ? item.tags.join(', ') : ''
      const gallery = item?.gallery ? item.gallery.map(g => (typeof g === 'string' ? { url: g, public_id: null } : g)) : []
      
      setFormData(item ? { ...item, tags: tagsValue, gallery } : { 
        title: '', slug: '', description: '', content: '', image: '', tags: '', link: '', 
        category: 'Medical', // القيمة الافتراضية
        gallery: [] 
      })
    } else {
      setFormData(item || { title: '', shortDescription: '', fullContent: '', icon: '', image: '' })
    }
    setShowModal(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    try {
      const dataToSend = { ...formData }
      
      if (!editingItem) {
          delete dataToSend.id;
          delete dataToSend.createdAt;
          delete dataToSend.updatedAt;
      }

      if (activeTab === 'projects') {
        if (typeof dataToSend.tags === 'string') {
          dataToSend.tags = dataToSend.tags.split(',').map(t => t.trim()).filter(t => t !== '')
        }
        if (!dataToSend.slug && dataToSend.title) {
          dataToSend.slug = String(dataToSend.title).toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-_]/g, '')
        }
        if (Array.isArray(dataToSend.gallery)) {
          dataToSend.gallery = dataToSend.gallery.map(g => (typeof g === 'string' ? g : g.url))
        }
      }

      if (editingItem) {
        await api.put(`/${activeTab}/${editingItem.id}`, dataToSend)
        addToast('success', 'Updated successfully')
      } else {
        await api.post(`/${activeTab}`, dataToSend)
        addToast('success', 'Created successfully')
      }
      
      setShowModal(false)
      await fetchData()
    } catch (err) {
      console.error("Save Error:", err)
      addToast('error', err.response?.data?.error || 'Operation failed')
    }
  }

  const handleDelete = async () => {
    try {
      await api.delete(`/${activeTab}/${confirmDelete.id}`)
      addToast('success', 'Deleted successfully')
      setConfirmDelete({ open: false, id: null })
      await fetchData()
    } catch (err) {
      addToast('error', 'Delete failed')
    }
  }

  // --- منطق رفع الصور ---
  const handleUpload = async (e, field) => {
    const file = e.target.files[0]
    if (!file) return
    const localUrl = URL.createObjectURL(file)
    setFormData(prev => ({ ...prev, [field]: localUrl, [`${field}Temp`]: true }))
    setIsUploading(true)
    const fd = new FormData()
    fd.append('files', file)
    try {
      const res = await api.post('/upload', fd)
      const uploaded = res.data.uploaded[0]
      setFormData(prev => ({ ...prev, [field]: uploaded.url, [`${field}PublicId`]: uploaded.public_id, [`${field}Temp`]: false }))
      addToast('success', 'Image uploaded')
    } catch (err) {
      setFormData(prev => ({ ...prev, [field]: null }))
      addToast('error', 'Upload failed')
    } finally { setIsUploading(false) }
  }

  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    setIsUploading(true)
    const tempEntries = files.map(f => ({ url: URL.createObjectURL(f), public_id: null, __temp: true }))
    setFormData(prev => ({ ...prev, gallery: [...(prev.gallery || []), ...tempEntries] }))
    const fd = new FormData()
    files.forEach(f => fd.append('files', f))
    try {
      const res = await api.post('/upload', fd)
      const uploaded = res.data.uploaded
      setFormData(prev => {
        const g = prev.gallery ? [...prev.gallery] : []
        const replaceStart = g.length - tempEntries.length
        for (let i = 0; i < uploaded.length; i++) {
          if (g[replaceStart + i]) {
             g[replaceStart + i] = { url: uploaded[i].url, public_id: uploaded[i].public_id }
          }
        }
        return { ...prev, gallery: g }
      })
      addToast('success', 'Gallery updated')
    } catch (err) { addToast('error', 'Gallery upload failed') } finally { setIsUploading(false) }
  }

  const removeImageField = (field) => {
    setFormData(prev => ({ ...prev, [field]: null, [`${field}PublicId`]: null }))
  }

  const removeGalleryImage = (index) => {
    setFormData(prev => {
      const g = [...(prev.gallery || [])]
      g.splice(index, 1)
      return { ...prev, gallery: g }
    })
  }

  const safeItems = Array.isArray(items) ? items : []
  const filteredItems = safeItems.filter(i => {
      const search = searchTerm.toLowerCase();
      return (i.title?.toLowerCase().includes(search)) || 
             (i.category?.toLowerCase().includes(search));
  })

  const generateSlug = () => {
    if (formData.title) {
        const slug = formData.title.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-_]/g, '')
        setFormData(prev => ({ ...prev, slug }))
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-accent selection:text-black overflow-x-hidden flex flex-col">
      <Toast toasts={toasts} onClose={(id) => setToasts(p => p.filter(t => t.id !== id))} />
      <ConfirmDialog open={confirmDelete.open} title="Delete Item?" message="This action cannot be undone." onConfirm={handleDelete} onCancel={() => setConfirmDelete({ open: false, id: null })} />

      <Navbar />

      <div className="flex flex-1 pt-20 h-[calc(100vh)] overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-slate-900/40 backdrop-blur-xl border-r border-white/5 flex flex-col py-8 z-40 hidden md:flex">
          <div className="px-6 mb-8">
             <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Management</h2>
             <div className="flex flex-col gap-2">
                {[
                  { id: 'projects', icon: <FaProjectDiagram />, label: 'Projects' },
                  { id: 'services', icon: <FaLayerGroup />, label: 'Services' },
                  { id: 'messages', icon: <FaEnvelope />, label: 'Messages', count: counts.messages }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all relative ${activeTab === tab.id ? 'bg-accent text-black font-bold shadow-lg shadow-accent/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                  >
                    {tab.icon} {tab.label}
                    {tab.count > 0 && <span className="absolute right-3 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{tab.count}</span>}
                  </button>
                ))}
             </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col h-full overflow-hidden relative">
          <header className="px-6 py-6 border-b border-white/5 bg-slate-900/20 backdrop-blur-md flex flex-wrap justify-between items-center gap-4">
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight capitalize">{activeTab}</h1>
              <p className="text-xs text-slate-500 font-mono mt-1">Manage your {activeTab} content</p>
            </div>
            {activeTab !== 'messages' && (
              <button onClick={() => openModal()} className="btn-primary flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold shadow-lg hover:-translate-y-1 transition-all whitespace-nowrap">
                <FaPlus /> <span>New Item</span>
              </button>
            )}
          </header>

          <div className="flex-1 overflow-y-auto px-6 py-8 custom-scrollbar pb-24">
            {/* Project List */}
            {loading ? (
              <div className="h-64 flex items-center justify-center"><Spinner /></div>
            ) : (
              <motion.div layout>
                {activeTab === 'projects' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                      {filteredItems.map((item, i) => (
                        <motion.div 
                          key={item.id}
                          layout
                          className="group relative bg-slate-900/40 backdrop-blur-sm border border-white/5 rounded-3xl overflow-hidden hover:border-accent/30 hover:shadow-2xl hover:shadow-accent/5 transition-all duration-500 flex flex-col"
                        >
                          {/* Image */}
                          <div className="h-48 overflow-hidden relative bg-slate-950">
                             <img src={item.image || item.icon} onError={(e) => { e.target.src = FALLBACK_SVG }} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100" />
                             {/* Actions */}
                             <div className="absolute top-4 right-4 flex gap-2 translate-y-[-10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                               <button onClick={() => openModal(item)} className="p-2 bg-white/10 backdrop-blur-md rounded-xl text-white hover:bg-accent hover:text-black transition-colors shadow-lg"><FaEdit /></button>
                               <button onClick={() => setConfirmDelete({ open: true, id: item.id })} className="p-2 bg-black/40 backdrop-blur-md rounded-xl text-red-400 hover:bg-red-500 hover:text-white transition-colors shadow-lg"><FaTrash /></button>
                             </div>
                             {/* Badge */}
                             <span className="absolute top-4 left-4 bg-black/50 backdrop-blur-md text-[10px] font-bold px-2 py-1 rounded text-white border border-white/5">
                                {item.category || 'Uncategorized'}
                             </span>
                          </div>
                          {/* Info */}
                          <div className="p-5 flex-1 flex flex-col">
                            <h3 className="font-bold text-white text-lg truncate mb-2">{item.title}</h3>
                            <p className="text-xs text-slate-400 line-clamp-2 mb-4 flex-1">{item.description}</p>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
                {/* Add Services & Messages rendering here if needed same as before */}
              </motion.div>
            )}
          </div>
        </main>
      </div>

      {/* --- EDIT/CREATE MODAL --- */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowModal(false)} />
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 50 }} animate={{ scale: 1, opacity: 1, y: 0 }} className="relative w-full max-h-[90vh] md:max-w-4xl bg-slate-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
              
              {/* Header */}
              <div className="px-8 py-6 border-b border-white/5 flex justify-between items-center bg-slate-900/95 backdrop-blur-sm z-10">
                <h3 className="text-xl font-bold text-white">
                  {editingItem ? `Edit ${activeTab.slice(0,-1)}` : `Create New ${activeTab.slice(0,-1)}`}
                </h3>
                <button onClick={() => setShowModal(false)}><FaTimes className="text-slate-400 hover:text-white" /></button>
              </div>

              {/* Form */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                <form id="itemForm" onSubmit={handleSave} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {/* Left: Text Inputs */}
                      <div className="md:col-span-2 space-y-6">
                          <InputGroup label="Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required placeholder="Enter title..." />
                          
                          {/* --- هنا الإضافة المهمة: قائمة التصنيف --- */}
                          {activeTab === 'projects' && (
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1 block">Project Sector (Category)</label>
                              <select 
                                value={formData.category || 'General'}
                                onChange={e => setFormData({...formData, category: e.target.value})}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-accent outline-none cursor-pointer"
                              >
                                {/* Default option */}
                                <option value="General">General (Uncategorized)</option>
                                {/* Sectors from list */}
                                {SECTORS.map(sec => <option key={sec} value={sec}>{sec}</option>)}
                              </select>
                            </div>
                          )}

                          {activeTab === 'projects' && (
                             <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                   <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Slug (URL)</label>
                                   <button type="button" onClick={generateSlug} className="text-xs text-accent hover:text-accent/80 flex items-center gap-1"><FaMagic size={12} /> Auto</button>
                                </div>
                                <input 
                                   type="text" 
                                   value={formData.slug || ''} 
                                   onChange={e => setFormData({...formData, slug: e.target.value})} 
                                   placeholder="auto-generated-slug"
                                   className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-accent outline-none font-mono"
                                />
                                {formData.slug && <p className="text-[10px] text-slate-500">URL: /{formData.slug}</p>}
                             </div>
                          )}

                          <InputGroup label="Description" isTextArea value={formData.description || formData.shortDescription} onChange={e => setFormData({...formData, [activeTab === 'projects' ? 'description' : 'shortDescription']: e.target.value})} placeholder="Brief summary..." />
                      </div>

                      {/* Right: Image */}
                      <div className="md:col-span-1">
                          <UploadBox label="Cover Image" preview={formData.image} onChange={(e) => handleUpload(e, 'image')} loading={isUploading} onRemove={() => removeImageField('image')} />
                      </div>
                  </div>
                  
                  {/* Detailed Content & Gallery */}
                  <div className="pt-6 border-t border-white/5 space-y-6">
                      <InputGroup label="Full Content (Markdown)" isTextArea value={formData.content || formData.fullContent} onChange={e => setFormData({...formData, [activeTab === 'projects' ? 'content' : 'fullContent']: e.target.value})} />
                      
                      {activeTab === 'projects' && (
                          <UploadBox label="Project Gallery" isGallery gallery={formData.gallery} onChange={handleGalleryUpload} loading={isUploading} onRemoveGallery={removeGalleryImage} multiple />
                      )}
                  </div>
                </form>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-white/5 bg-slate-900 flex justify-end gap-4 z-20">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-3 rounded-xl text-slate-300 hover:text-white font-bold text-sm">Cancel</button>
                <button type="submit" form="itemForm" className="btn-primary px-8 py-3 rounded-xl shadow-xl font-bold text-sm">
                  {editingItem ? 'Save Changes' : 'Publish'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <Footer />
    </div>
  )
}

// Helpers
const InputGroup = ({ label, value, onChange, required, placeholder, isTextArea }) => (
  <div className="space-y-2 w-full">
    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">{label}</label>
    {isTextArea ? (
       <textarea rows="4" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-accent outline-none" value={value || ''} onChange={onChange} required={required} placeholder={placeholder} />
    ) : (
       <input className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-accent outline-none" value={value || ''} onChange={onChange} required={required} placeholder={placeholder} />
    )}
  </div>
)

const UploadBox = ({ label, loading, onChange, multiple, preview, isGallery, gallery, onRemove, onRemoveGallery }) => (
  <div className="space-y-2 h-full flex flex-col">
    <div className="flex justify-between items-center px-1">
       <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</label>
       {loading && <span className="text-xs text-accent animate-pulse font-bold">UPLOADING...</span>}
    </div>
    {!isGallery ? (
       <div className={`relative flex-1 border-2 border-dashed border-white/10 rounded-xl overflow-hidden hover:border-accent/40 transition-all bg-black/30 min-h-[150px] ${preview ? 'border-solid border-white/5' : ''}`}>
          <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-20" onChange={onChange} disabled={loading} />
          {preview ? (
             <div className="absolute inset-0 z-10"><img src={preview} className="w-full h-full object-cover" /><button onClick={(e) => {e.preventDefault(); onRemove()}} className="absolute bottom-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded z-30">Remove</button></div>
          ) : (
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-500 text-xs font-bold">Drop Image</div>
          )}
       </div>
    ) : (
       <div className="space-y-3">
          <div className="relative border-2 border-dashed border-white/10 rounded-xl p-6 text-center hover:border-accent/40 bg-black/30"><input type="file" multiple className="absolute inset-0 opacity-0 cursor-pointer" onChange={onChange} /><FaImages className="mx-auto text-2xl text-slate-500" /></div>
          {gallery?.length > 0 && <div className="grid grid-cols-3 gap-2">{gallery.map((img, i) => <div key={i} className="relative aspect-square rounded overflow-hidden"><img src={typeof img === 'string' ? img : img.url} className="w-full h-full object-cover" /><button type="button" onClick={() => onRemoveGallery(i)} className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 flex items-center justify-center text-red-500"><FaTrash /></button></div>)}</div>}
       </div>
    )}
  </div>
)