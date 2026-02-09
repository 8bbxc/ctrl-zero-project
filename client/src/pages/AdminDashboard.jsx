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

// --- Constants ---
// هذه القائمة يجب أن تطابق تماماً الأقسام في الـ Frontend
const SECTORS = ['Medical', 'E-Commerce', 'Restaurant', 'Corporate', 'Education', 'Real Estate'];
const FALLBACK_SVG = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100'><rect width='100%' height='100%' fill='%231e293b'/><text x='50%' y='50%' fill='%23475569' font-size='12' font-family='Arial' text-anchor='middle' dominant-baseline='middle'>No Image</text></svg>`;

// --- Components ---
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

  // Auth Check
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

  // --- CRUD Modal Logic ---
  const openModal = (item = null) => {
    if (activeTab === 'messages') return; 
    setEditingItem(item)
    
    if (activeTab === 'projects') {
      // تحويل التاغات من مصفوفة إلى نص للعرض
      const tagsValue = item?.tags && Array.isArray(item.tags) ? item.tags.join(', ') : ''
      
      // معالجة المعرض: التأكد من أنه مصفوفة كائنات
      const gallery = item?.gallery ? item.gallery.map(g => (typeof g === 'string' ? { url: g, public_id: null } : g)) : []
      
      setFormData(item ? { ...item, tags: tagsValue, gallery } : { 
        title: '', slug: '', description: '', content: '', image: '', tags: '', link: '', category: 'Medical', gallery: [] 
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
      
      // Cleanup
      if (!editingItem) {
          delete dataToSend.id;
          delete dataToSend.createdAt;
          delete dataToSend.updatedAt;
      }

      // Projects Logic
      if (activeTab === 'projects') {
        // Convert tags string -> Array
        if (typeof dataToSend.tags === 'string') {
          dataToSend.tags = dataToSend.tags.split(',').map(t => t.trim()).filter(t => t !== '')
        }

        // Auto Slug if empty
        if (!dataToSend.slug && dataToSend.title) {
          dataToSend.slug = String(dataToSend.title).toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-_]/g, '')
        }

        // Gallery: Convert objects back to URL strings for backend storage
        if (Array.isArray(dataToSend.gallery)) {
          dataToSend.gallery = dataToSend.gallery.map(g => (typeof g === 'string' ? g : g.url))
        }
      }

      // API Call
      if (editingItem) {
        await api.put(`/${activeTab}/${editingItem.id}`, dataToSend)
        addToast('success', 'Item updated successfully')
      } else {
        await api.post(`/${activeTab}`, dataToSend)
        addToast('success', 'Item created successfully')
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

  // --- Image Handlers ---
  const handleUpload = async (e, field) => {
    const file = e.target.files[0]
    if (!file) return
    
    // Preview immediately
    const localUrl = URL.createObjectURL(file)
    setFormData(prev => ({ ...prev, [field]: localUrl, [`${field}Temp`]: true }))
    
    setIsUploading(true)
    const fd = new FormData()
    fd.append('files', file)
    
    try {
      const res = await api.post('/upload', fd)
      const uploaded = res.data.uploaded[0] // Expecting { url: '...', public_id: '...' }
      
      setFormData(prev => ({ 
        ...prev, 
        [field]: uploaded.url, 
        [`${field}PublicId`]: uploaded.public_id, // Store ID for potential cleanup later
        [`${field}Temp`]: false 
      }))
      addToast('success', 'Image uploaded successfully')
    } catch (err) {
      setFormData(prev => ({ ...prev, [field]: null }))
      addToast('error', 'Upload failed')
    } finally { 
      setIsUploading(false) 
    }
  }

  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    setIsUploading(true)

    // Temp previews
    const tempEntries = files.map(f => ({ url: URL.createObjectURL(f), public_id: null, __temp: true }))
    setFormData(prev => ({ ...prev, gallery: [...(prev.gallery || []), ...tempEntries] }))

    const fd = new FormData()
    files.forEach(f => fd.append('files', f))

    try {
      const res = await api.post('/upload', fd)
      const uploaded = res.data.uploaded // Array of { url, public_id }
      
      setFormData(prev => {
        const g = prev.gallery ? [...prev.gallery] : []
        // Replace temp entries with real data
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

  // --- Filtering ---
  const safeItems = Array.isArray(items) ? items : []
  const filteredItems = safeItems.filter(i => {
      const search = searchTerm.toLowerCase();
      return (i.title?.toLowerCase().includes(search)) || 
             (i.subject?.toLowerCase().includes(search)) ||
             (i.name?.toLowerCase().includes(search));
  })

  // --- Auto Slug Helper ---
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

      {/* Background Ambience */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[800px] h-[800px] bg-purple-600/5 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[url('/images/grid.svg')] opacity-[0.02]" />
      </div>

      <Navbar />

      <div className="flex flex-1 pt-20 h-[calc(100vh)] overflow-hidden">
        
        {/* Sidebar (Desktop) */}
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

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col h-full overflow-hidden relative">
          
          {/* Header */}
          <header className="px-6 py-6 border-b border-white/5 bg-slate-900/20 backdrop-blur-md flex flex-wrap justify-between items-center gap-4">
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight capitalize">{activeTab}</h1>
              <p className="text-xs text-slate-500 font-mono mt-1">Manage your {activeTab} content</p>
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative group flex-1 md:flex-none">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-accent transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full md:w-64 bg-slate-950/60 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm focus:border-accent/50 outline-none transition-all text-white placeholder-slate-600"
                />
              </div>
              
              {activeTab !== 'messages' && (
                <button onClick={() => openModal()} className="btn-primary flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold shadow-lg hover:-translate-y-1 transition-all whitespace-nowrap">
                  <FaPlus /> <span>New Item</span>
                </button>
              )}
            </div>
          </header>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-6 py-8 custom-scrollbar pb-24">
            
            {/* Stats Row (Only visible on larger screens generally) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
               <StatCard title="Total Projects" count={counts.projects} icon={<FaProjectDiagram />} color="text-blue-500" delay={0.1} />
               <StatCard title="Total Services" count={counts.services} icon={<FaLayerGroup />} color="text-purple-500" delay={0.2} />
               <StatCard title="Messages" count={counts.messages} icon={<FaEnvelope />} color="text-emerald-500" delay={0.3} />
            </div>

            {loading ? (
              <div className="h-64 flex items-center justify-center"><Spinner /></div>
            ) : (
              <motion.div layout>
                {/* --- Messages View --- */}
                {activeTab === 'messages' && (
                  <div className="grid gap-4">
                    <AnimatePresence>
                      {filteredItems.map((msg, i) => (
                        <motion.div 
                          key={msg.id}
                          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }} transition={{ delay: i * 0.05 }}
                          className="bg-slate-900/40 border border-white/5 rounded-2xl p-6 hover:bg-slate-800/40 transition-all group relative overflow-hidden"
                        >
                          <div className={`absolute left-0 top-0 bottom-0 w-1 ${!msg.read ? 'bg-accent' : 'bg-slate-700'}`} />
                          <div className="flex justify-between items-start gap-4 mb-4">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 border border-white/5">
                                <FaUser />
                              </div>
                              <div>
                                <h3 className="font-bold text-white text-lg flex items-center gap-2">
                                  {msg.name || "Unknown"}
                                  {!msg.read && <span className="bg-accent text-black text-[10px] px-2 rounded-full">NEW</span>}
                                </h3>
                                <p className="text-sm text-slate-400 font-mono">{msg.email}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-slate-500 bg-black/20 px-3 py-1 rounded-lg border border-white/5 flex items-center gap-2"><FaClock /> {new Date(msg.date || msg.createdAt).toLocaleDateString()}</span>
                              <button onClick={() => setConfirmDelete({ open: true, id: msg.id })} className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"><FaTrash /></button>
                            </div>
                          </div>
                          <div className="pl-16">
                             <h4 className="text-white font-bold mb-2">{msg.subject}</h4>
                             <p className="text-slate-300 text-sm leading-relaxed bg-black/20 p-4 rounded-xl border border-white/5 font-light">{msg.fullContent || msg.message}</p>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    {filteredItems.length === 0 && <EmptyState />}
                  </div>
                )}

                {/* --- Projects/Services Grid View --- */}
                {activeTab !== 'messages' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                      {filteredItems.map((item, i) => (
                        <motion.div 
                          key={item.id}
                          layout
                          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ delay: i * 0.05 }}
                          className="group relative bg-slate-900/40 backdrop-blur-sm border border-white/5 rounded-3xl overflow-hidden hover:border-accent/30 hover:shadow-2xl hover:shadow-accent/5 transition-all duration-500 flex flex-col"
                        >
                          <div className="h-48 overflow-hidden relative bg-slate-950">
                             <img 
                               src={item.image || item.icon} 
                               onError={(e) => { e.target.src = FALLBACK_SVG }}
                               alt="" 
                               className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                             />
                             <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-90" />
                             
                             {/* Actions Overlay */}
                             <div className="absolute top-4 right-4 flex gap-2 translate-y-[-10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                               <button onClick={() => openModal(item)} className="p-2 bg-white/10 backdrop-blur-md rounded-xl text-white hover:bg-accent hover:text-black transition-colors shadow-lg"><FaEdit /></button>
                               <button onClick={() => setConfirmDelete({ open: true, id: item.id })} className="p-2 bg-black/40 backdrop-blur-md rounded-xl text-red-400 hover:bg-red-500 hover:text-white transition-colors shadow-lg"><FaTrash /></button>
                             </div>

                             {/* ID Badge */}
                             <span className="absolute top-4 left-4 bg-black/50 backdrop-blur-md text-[10px] font-bold px-2 py-1 rounded text-white border border-white/5">ID: {item.id}</span>
                          </div>

                          <div className="p-5 flex-1 flex flex-col">
                            <div className="flex justify-between items-start mb-2">
                               <h3 className="font-bold text-white text-lg truncate w-full">{item.title}</h3>
                            </div>
                            
                            {item.category && (
                              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded w-fit mb-3 border border-cyan-500/20">{item.category}</span>
                            )}

                            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4 flex-1">{item.shortDescription || item.description || "No description."}</p>
                            
                            <div className="flex items-center gap-2 pt-3 border-t border-white/5 text-[10px] flex-wrap">
                              {item.gallery?.length > 0 && (
                                <span className="bg-white/5 px-2 py-1 rounded text-slate-400 flex items-center gap-1"><FaImages /> {item.gallery.length}</span>
                              )}
                              {item.tags && Array.isArray(item.tags) && item.tags.slice(0,2).map((t, idx) => (
                                <span key={idx} className="bg-accent/5 text-accent px-2 py-1 rounded border border-accent/10">#{t}</span>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    {filteredItems.length === 0 && <EmptyState />}
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </main>
      </div>

      {/* --- Mobile Sidebar Overlay --- */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-slate-900 border-t border-white/10 flex justify-around items-center z-50">
         {['projects', 'services', 'messages'].map(id => (
            <button key={id} onClick={() => setActiveTab(id)} className={`flex flex-col items-center gap-1 ${activeTab === id ? 'text-accent' : 'text-slate-500'}`}>
               {id === 'projects' && <FaProjectDiagram />}
               {id === 'services' && <FaLayerGroup />}
               {id === 'messages' && <FaEnvelope />}
               <span className="text-[10px] uppercase font-bold">{id}</span>
            </button>
         ))}
      </div>

      {/* --- EDIT/CREATE MODAL --- */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowModal(false)} />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 50 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.95, opacity: 0, y: 50 }} 
              className="relative w-full max-h-[90vh] md:max-w-4xl bg-gradient-to-b from-slate-900 to-slate-950 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Modal Header */}
              <div className="px-8 py-6 border-b border-white/5 flex justify-between items-center bg-slate-900/95 backdrop-blur-sm z-10">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-accent rounded-full mr-2"/>
                  {editingItem ? `Edit ${activeTab.slice(0,-1)}` : `Create New ${activeTab.slice(0,-1)}`}
                </h3>
                <button onClick={() => setShowModal(false)} className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 text-slate-400 hover:bg-red-500 hover:text-white transition"><FaTimes /></button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                <form id="itemForm" onSubmit={handleSave} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {/* Left Column: Text Inputs */}
                      <div className="md:col-span-2 space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputGroup label="Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required placeholder="Enter title..." />
                            
                            {activeTab === 'projects' && (
                               <div className="space-y-2">
                                  <div className="flex justify-between">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Slug</label>
                                    <button type="button" onClick={generateSlug} className="text-[10px] text-accent flex items-center gap-1 hover:underline"><FaMagic /> Auto</button>
                                  </div>
                                  <input className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-accent outline-none font-mono text-xs" value={formData.slug || ''} onChange={e => setFormData({...formData, slug: e.target.value})} placeholder="url-slug-here" />
                               </div>
                            )}
                          </div>

                          {activeTab === 'projects' && (
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1 block">Sector / Category</label>
                              <select 
                                value={formData.category || 'General'}
                                onChange={e => setFormData({...formData, category: e.target.value})}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-accent outline-none cursor-pointer"
                              >
                                {SECTORS.map(sec => <option key={sec} value={sec}>{sec}</option>)}
                                <option value="General">General</option>
                              </select>
                            </div>
                          )}

                          <InputGroup label="Short Description" isTextArea value={formData.description || formData.shortDescription} onChange={e => setFormData({...formData, [activeTab === 'projects' ? 'description' : 'shortDescription']: e.target.value})} placeholder="Brief summary for the card..." />
                          
                          {activeTab === 'projects' && (
                             <div className="grid grid-cols-2 gap-4">
                                <InputGroup label="External Link" icon={<FaLink />} value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} placeholder="https://..." />
                                <InputGroup label="Tags (Comma separated)" icon={<FaTag />} value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} placeholder="React, Node, UI/UX" />
                             </div>
                          )}
                      </div>

                      {/* Right Column: Main Image */}
                      <div className="md:col-span-1">
                          <UploadBox 
                            label={activeTab === 'services' ? "Icon / Icon URL" : "Cover Image"} 
                            preview={activeTab === 'services' ? formData.icon : formData.image} 
                            onChange={(e) => handleUpload(e, activeTab === 'services' ? 'icon' : 'image')} 
                            loading={isUploading} 
                            onRemove={activeTab === 'services' ? () => removeImageField('icon') : () => removeImageField('image')} 
                            isIcon={activeTab === 'services'} 
                          />
                      </div>
                  </div>

                  {/* Full Content & Gallery Section */}
                  <div className="pt-6 border-t border-white/5 space-y-6">
                      <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase">Detailed Content (Markdown Supported)</label>
                          <textarea rows="6" className="w-full bg-black/20 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:border-accent outline-none font-mono leading-relaxed" value={formData.content || formData.fullContent || ''} onChange={e => setFormData({...formData, [activeTab === 'projects' ? 'content' : 'fullContent']: e.target.value})} placeholder="# Write details..." />
                      </div>

                      {activeTab === 'projects' && (
                          <div className="mt-4">
                             <UploadBox label="Project Gallery" isGallery gallery={formData.gallery} onChange={handleGalleryUpload} loading={isUploading} onRemoveGallery={removeGalleryImage} multiple />
                          </div>
                      )}
                  </div>
                </form>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-white/5 bg-slate-900 flex justify-end gap-4 z-20">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition font-bold text-sm">Cancel</button>
                <button type="submit" form="itemForm" className="btn-primary px-8 py-3 rounded-xl shadow-xl shadow-accent/20 hover:shadow-accent/40 font-bold text-sm tracking-wide">
                  {editingItem ? 'Save Changes' : 'Publish Item'}
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

// --- Sub-components ---
const EmptyState = () => (
  <div className="col-span-full flex flex-col items-center justify-center py-20 text-center opacity-50">
     <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mb-4"><FaSearch className="text-4xl text-slate-600" /></div>
     <h3 className="text-xl font-bold text-white">No items found</h3>
     <p className="text-slate-400">Try adjusting your search or add a new item.</p>
  </div>
)

const InputGroup = ({ label, value, onChange, required, placeholder, isTextArea, icon }) => (
  <div className="space-y-2 w-full">
    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1 flex items-center gap-2">{icon} {label}</label>
    {isTextArea ? (
       <textarea rows="3" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-accent outline-none transition-all placeholder-slate-600 resize-none" value={value || ''} onChange={onChange} required={required} placeholder={placeholder} />
    ) : (
       <input className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-accent outline-none transition-all placeholder-slate-600" value={value || ''} onChange={onChange} required={required} placeholder={placeholder} />
    )}
  </div>
)

const UploadBox = ({ label, loading, onChange, multiple, preview, isGallery, gallery, onRemove, onRemoveGallery, isIcon }) => (
  <div className="space-y-2 h-full flex flex-col">
    <div className="flex justify-between items-center px-1">
       <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</label>
       {loading && <span className="text-xs text-accent animate-pulse font-bold">UPLOADING...</span>}
    </div>
    {!isGallery ? (
       <div className={`relative flex-1 border-2 border-dashed border-white/10 rounded-xl overflow-hidden hover:border-accent/40 transition-all group bg-black/30 min-h-[150px] ${preview ? 'border-solid border-white/5' : ''}`}>
          <input type="file" multiple={multiple} className="absolute inset-0 opacity-0 cursor-pointer z-20" onChange={onChange} disabled={loading} />
          {preview ? (
             <div className="absolute inset-0 z-10">
                <img src={preview} alt="Preview" className={`w-full h-full ${isIcon ? 'object-contain p-8' : 'object-cover'}`} loading="lazy" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                   <span className="text-white text-xs font-bold">Change Image</span>
                   <button onClick={(e) => { e.preventDefault(); onRemove?.() }} className="px-3 py-1 bg-red-500/80 hover:bg-red-500 text-white text-xs rounded z-30 relative">Remove</button>
                </div>
             </div>
          ) : (
             <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform"><FaCloudUploadAlt className="text-xl text-slate-400" /></div>
                <span className="text-xs text-slate-500 font-bold text-center px-2">Drop image here</span>
             </div>
          )}
       </div>
    ) : (
       <div className="space-y-3">
          <div className="relative border-2 border-dashed border-white/10 rounded-xl p-6 text-center hover:border-accent/40 transition-all bg-black/30 group cursor-pointer">
             <input type="file" multiple className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={onChange} disabled={loading} />
             <div className="pointer-events-none">
                <FaImages className="mx-auto text-2xl text-slate-500 mb-2 group-hover:text-white transition-colors" />
                <span className="text-xs text-slate-400 font-bold block">Add Images to Gallery</span>
             </div>
          </div>
          {gallery?.length > 0 && (
             <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {gallery.map((img, i) => (
                   <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-white/10 group">
                      <img src={typeof img === 'string' ? img : img.url} className="w-full h-full object-cover" alt="" loading="lazy" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                         <button type="button" onClick={() => onRemoveGallery?.(i)} className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform"><FaTrash size={12} /></button>
                      </div>
                   </div>
                ))}
             </div>
          )}
       </div>
    )}
  </div>
)