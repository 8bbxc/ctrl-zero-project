import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FaProjectDiagram, FaLayerGroup, FaEnvelope, 
  FaPlus, FaTrash, FaEdit, FaSearch, FaTimes, FaCloudUploadAlt, FaImages, FaFingerprint, FaClock, FaGlobe, FaUser, FaCheckCircle
} from 'react-icons/fa'
import { logout } from '../services/auth'
import api from '../services/api'
import Toast from '../components/Toast'
import Spinner from '../components/Spinner'
import ConfirmDialog from '../components/ConfirmDialog'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

// --- Helpers ---
const FALLBACK_SVG = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100'><rect width='100%' height='100%' fill='%231e293b'/><text x='50%' y='50%' fill='%23475569' font-size='12' font-family='Arial' text-anchor='middle' dominant-baseline='middle'>No Image</text></svg>`;

const getExt = (url) => {
  try {
    const m = String(url).split('?')[0].match(/\.([a-z0-9]{1,5})$/i);
    return m ? m[1].toUpperCase() : 'IMG';
  } catch (e) { return '' }
}

// --- Components ---
const StatCard = ({ title, count, icon, color, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, type: 'spring' }}
    className="relative overflow-hidden bg-slate-900/60 backdrop-blur-xl border border-white/5 p-4 md:p-6 rounded-2xl md:rounded-3xl group hover:border-white/10 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10"
  >
    <div className={`absolute -top-4 -right-4 p-4 opacity-5 md:opacity-10 group-hover:opacity-20 transition-opacity ${color} text-6xl md:text-8xl rotate-12`}>
      {icon}
    </div>
    <div className="relative z-10">
      <div className={`w-8 md:w-10 h-8 md:h-10 mb-2 md:mb-4 rounded-lg md:rounded-xl flex items-center justify-center bg-white/5 ${color} bg-clip-text text-lg md:text-2xl`}>
        {icon}
      </div>
      <h3 className="text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-0.5 md:mb-1">{title}</h3>
      <p className="text-2xl md:text-4xl font-black text-white tracking-tight">{count}</p>
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
      addToast('error', 'Failed to load data. Check server logs.')
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

  // --- CRUD Logic ---
  const openModal = (item = null) => {
    if (activeTab === 'messages') return; 
    setEditingItem(item)
    
    if (activeTab === 'projects') {
      const tagsValue = item?.tags && Array.isArray(item.tags) ? item.tags.join(', ') : ''
      // Ensure gallery is array of objects for preview
      const gallery = item?.gallery ? item.gallery.map(g => (typeof g === 'string' ? { url: g, public_id: null } : g)) : []
      setFormData(item ? { ...item, tags: tagsValue, gallery } : { title: '', slug: '', description: '', content: '', image: '', tags: '', link: '', gallery: [] })
    } else {
      setFormData(item || { title: '', shortDescription: '', fullContent: '', icon: '', image: '' })
    }
    setShowModal(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    try {
      // 1. Prepare Data
      const dataToSend = { ...formData }
      
      // Clean up fields that shouldn't be sent for new items
      if (!editingItem) {
          delete dataToSend.id;
          delete dataToSend.createdAt;
          delete dataToSend.updatedAt;
      }

      // Convert tags string to array
      if (activeTab === 'projects' && typeof dataToSend.tags === 'string') {
        dataToSend.tags = dataToSend.tags.split(',').map(t => t.trim()).filter(t => t !== '')
      }

      // Generate slug if missing
      if (activeTab === 'projects' && !dataToSend.slug && dataToSend.title) {
        dataToSend.slug = String(dataToSend.title).toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-_]/g, '')
      }

      // IMPORTANT: Convert gallery objects back to array of strings (URLs) for backend
      if (activeTab === 'projects' && Array.isArray(dataToSend.gallery)) {
        dataToSend.gallery = dataToSend.gallery.map(g => (typeof g === 'string' ? g : g.url))
      }

      // 2. Send Request
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

  // --- Image Handling ---
  const removeGalleryImage = async (index, public_id) => {
    try {
      setFormData(prev => {
        const g = [...(prev.gallery || [])]
        const removed = g.splice(index, 1)[0]
        try { if (removed?.__temp && removed?.url) URL.revokeObjectURL(removed.url) } catch(e) {}
        return { ...prev, gallery: g }
      })
      if (public_id) await api.delete('/upload', { data: { public_id } })
    } catch (err) { console.error(err) }
  }

  const removeImageField = async (field) => {
    try {
      const public_id = formData[`${field}PublicId`]
      try { if (formData[`${field}Temp`] && formData[field]) URL.revokeObjectURL(formData[field]) } catch(e) {}
      if (public_id) await api.delete('/upload', { data: { public_id } })
      setFormData(prev => ({ ...prev, [field]: null, [`${field}PublicId`]: null, [`${field}Temp`]: false }))
    } catch (err) { console.error(err) }
  }

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
      setFormData(prev => ({ ...prev, [field]: null, [`${field}Temp`]: false }))
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
          // Check if index exists to prevent error
          if (g[replaceStart + i]) {
             g[replaceStart + i] = { url: uploaded[i].url, public_id: uploaded[i].public_id }
          }
        }
        return { ...prev, gallery: g }
      })
      addToast('success', 'Gallery updated')
    } catch (err) { addToast('error', 'Gallery upload failed') } finally { setIsUploading(false) }
  }

  const safeItems = Array.isArray(items) ? items : []
  const filteredItems = safeItems.filter(i => {
      const search = searchTerm.toLowerCase();
      return (i.title?.toLowerCase().includes(search)) || 
             (i.subject?.toLowerCase().includes(search)) ||
             (i.name?.toLowerCase().includes(search));
  })

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-accent selection:text-black overflow-x-hidden flex flex-col">
      <Toast toasts={toasts} onClose={(id) => setToasts(p => p.filter(t => t.id !== id))} />
      <ConfirmDialog open={confirmDelete.open} title="Delete Item?" message="This action cannot be undone." onConfirm={handleDelete} onCancel={() => setConfirmDelete({ open: false, id: null })} />

      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[800px] h-[800px] bg-purple-600/5 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[url('/images/grid.svg')] opacity-[0.02]" />
      </div>

      <Navbar />

      <div className="flex flex-1 h-[calc(100vh-80px)] overflow-hidden pt-20"> {/* Added pt-20 for Navbar spacing */}
        
        {/* Sidebar - Mobile Tab Menu */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-slate-900/40 backdrop-blur-xl border-t border-white/5 flex items-center justify-around z-40">
          {[
            { id: 'projects', icon: <FaProjectDiagram className="text-xl" /> },
            { id: 'services', icon: <FaLayerGroup className="text-xl" /> },
            { id: 'messages', icon: <FaEnvelope className="text-xl" /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 h-full flex items-center justify-center transition-all relative ${activeTab === tab.id ? 'text-accent bg-accent/10' : 'text-slate-500 hover:text-white'}`}
            >
              {tab.icon}
              {tab.id === 'messages' && counts.messages > 0 && (
                <span className="absolute top-1 right-2 w-2.5 h-2.5 bg-red-500 rounded-full" />
              )}
            </button>
          ))}
        </nav>
        
        {/* Sidebar - Desktop */}
        <aside className="w-24 bg-slate-900/40 backdrop-blur-xl border-r border-white/5 flex flex-col items-center py-10 gap-8 z-40 hidden md:flex">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20 mb-4">
            <FaGlobe className="text-xl text-white" />
          </div>
          
          <div className="flex-1 flex flex-col gap-6 w-full px-4">
            {[
              { id: 'projects', icon: <FaProjectDiagram /> },
              { id: 'services', icon: <FaLayerGroup /> },
              { id: 'messages', icon: <FaEnvelope /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full aspect-square rounded-2xl flex items-center justify-center text-2xl transition-all duration-300 relative group ${activeTab === tab.id ? 'bg-accent text-black shadow-[0_0_25px_rgba(59,130,246,0.3)] scale-105' : 'text-slate-500 hover:bg-white/5 hover:text-white'}`}
              >
                {tab.icon}
                {tab.id === 'messages' && counts.messages > 0 && (
                  <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full border-2 border-slate-900" />
                )}
                <span className="absolute left-full ml-4 px-3 py-1 bg-slate-800 text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0 whitespace-nowrap border border-white/10 pointer-events-none z-50">
                  {tab.id.toUpperCase()}
                </span>
              </button>
            ))}
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 flex flex-col h-full overflow-hidden relative bg-gradient-to-br from-transparent to-slate-900/30 md:pb-0 pb-20">
          
          <header className="h-auto md:h-24 px-4 md:px-10 py-4 md:py-0 flex flex-col md:flex-row items-start md:items-center justify-between z-30 gap-4 md:gap-0">
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">Dashboard</h1>
              <p className="text-xs md:text-sm text-slate-500 font-mono mt-1 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"/> SYSTEM ONLINE
              </p>
            </div>

            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-6 w-full md:w-auto">
              <div className="relative group flex-1 md:flex-none">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-accent transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full md:w-72 bg-slate-950/60 border border-white/10 rounded-xl md:rounded-2xl pl-10 md:pl-12 pr-4 md:pr-6 py-2.5 md:py-3 text-sm focus:w-full md:focus:w-96 transition-all outline-none focus:border-accent/50 text-white placeholder-slate-600 shadow-inner"
                />
              </div>
              
              {activeTab !== 'messages' && (
                <button onClick={() => openModal()} className="btn-primary flex items-center justify-center gap-2 px-6 md:px-8 py-2.5 md:py-3 rounded-xl md:rounded-2xl text-xs md:text-sm font-bold shadow-lg hover:-translate-y-1 transition-all whitespace-nowrap">
                  <FaPlus /> <span className="hidden sm:inline">CREATE NEW</span>
                </button>
              )}
            </div>
          </header>

          <div className="flex-1 overflow-y-auto px-3 md:px-10 pb-10 md:pb-10 custom-scrollbar">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 mb-8 md:mb-12">
              <StatCard title="Total Projects" count={counts.projects} icon={<FaProjectDiagram />} color="text-blue-500" delay={0.1} />
              <StatCard title="Active Services" count={counts.services} icon={<FaLayerGroup />} color="text-purple-500" delay={0.2} />
              <StatCard title="Messages" count={counts.messages} icon={<FaEnvelope />} color="text-emerald-500" delay={0.3} />
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4 mb-6 md:mb-8">
              <h2 className="text-xl md:text-2xl font-bold text-white capitalize">{activeTab}</h2>
              <div className="hidden md:block h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
              <span className="text-[10px] md:text-xs font-mono text-slate-500">{filteredItems.length} ITEMS</span>
            </div>

            {loading ? (
              <div className="h-64 flex items-center justify-center"><Spinner /></div>
            ) : (
              <motion.div layout className="min-h-[200px]">
                {activeTab === 'messages' ? (
                  <div className="grid gap-2 md:gap-4">
                    <AnimatePresence>
                      {filteredItems.map((msg, i) => (
                        <motion.div 
                          key={msg.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="bg-slate-900/40 border border-white/5 rounded-xl md:rounded-2xl p-3 md:p-6 hover:bg-slate-800/40 hover:border-white/10 transition-all group relative overflow-hidden"
                        >
                          <div className={`absolute left-0 top-0 bottom-0 w-1 ${msg.read ? 'bg-slate-700' : 'bg-accent'}`} />
                          <div className="flex flex-col md:flex-row justify-between md:items-start gap-2 md:gap-4 mb-3 md:mb-4">
                            <div className="flex items-start gap-2 md:gap-4 min-w-0">
                              <div className="w-10 md:w-12 h-10 md:h-12 rounded-full bg-slate-800 flex-shrink-0 flex items-center justify-center text-slate-300 border border-white/5 shadow-inner">
                                <FaUser className="text-lg" />
                              </div>
                              <div className="flex flex-col min-w-0">
                                <h3 className="font-bold text-white text-sm md:text-lg flex items-center gap-2 flex-wrap">
                                  {msg.name || "Unknown Sender"}
                                  {!msg.read && <span className="bg-accent text-black text-[9px] md:text-[10px] px-1.5 md:px-2 rounded-full shadow-lg shadow-accent/20 flex-shrink-0">NEW</span>}
                                </h3>
                                <p className="text-xs md:text-sm text-slate-300 font-medium truncate">{msg.subject || "No Subject"}</p>
                                <p className="text-[10px] md:text-xs text-slate-500 font-mono mt-0.5 md:mt-1 flex items-center gap-1 truncate"><FaEnvelope className="text-accent/70 flex-shrink-0" /> {msg.email}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 ml-10 md:ml-0">
                              <span className="text-[9px] md:text-xs text-slate-500 flex items-center gap-1 bg-black/20 px-2 md:px-3 py-1 md:py-1.5 rounded-lg border border-white/5 flex-shrink-0"><FaClock className="text-[8px] md:text-xs" /> {new Date(msg.date || msg.createdAt).toLocaleDateString()}</span>
                              <button onClick={() => setConfirmDelete({ open: true, id: msg.id })} className="p-1.5 md:p-2 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded transition flex-shrink-0"><FaTrash className="text-sm" /></button>
                            </div>
                          </div>
                          <div className="pl-2 md:pl-16">
                             <p className="text-slate-300 text-xs md:text-sm leading-relaxed bg-black/20 p-3 md:p-5 rounded-lg md:rounded-2xl border border-white/5 font-light">{msg.fullContent || msg.message}</p>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    {filteredItems.length === 0 && <EmptyState />}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
                    <AnimatePresence>
                      {filteredItems.map((item, i) => (
                        <motion.div 
                          key={item.id}
                          layout
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ delay: i * 0.05 }}
                          className="group relative bg-slate-900/40 backdrop-blur-sm border border-white/5 rounded-3xl overflow-hidden hover:border-accent/30 hover:shadow-2xl hover:shadow-accent/5 transition-all duration-500"
                        >
                          <div className="h-32 sm:h-40 md:h-48 overflow-hidden relative bg-slate-950">
                             <img 
                               src={item.image || item.icon} 
                               alt="" 
                               onError={(e) => { e.target.src = FALLBACK_SVG }}
                               className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100" 
                             />
                             <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-90" />
                             <div className="absolute top-2 right-2 md:top-3 md:right-3 flex gap-1.5 md:gap-2 translate-y-[-10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                               <button onClick={() => openModal(item)} className="p-1.5 md:p-2 bg-white/10 backdrop-blur-md rounded-lg md:rounded-xl text-sm md:text-base text-white hover:bg-accent hover:text-black transition-colors shadow-lg"><FaEdit /></button>
                               <button onClick={() => setConfirmDelete({ open: true, id: item.id })} className="p-1.5 md:p-2 bg-black/40 backdrop-blur-md rounded-lg md:rounded-xl text-sm md:text-base text-red-400 hover:bg-red-500 hover:text-white transition-colors shadow-lg"><FaTrash /></button>
                             </div>
                             <div className="absolute top-2 left-2 md:top-3 md:left-3">
                               <span className="bg-black/50 backdrop-blur-md text-[8px] md:text-[10px] font-bold px-1.5 md:px-2 py-0.5 md:py-1 rounded text-white border border-white/5">ID: {item.id}</span>
                             </div>
                          </div>
                          <div className="p-3 md:p-5 relative z-20">
                            <h3 className="font-bold text-white text-sm md:text-lg mb-1 truncate">{item.title}</h3>
                            <p className="text-[11px] md:text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3 md:mb-4 min-h-[2em] md:min-h-[2.5em]">{item.shortDescription || item.description || "No description."}</p>
                            <div className="flex items-center gap-1 md:gap-2 pt-2 md:pt-3 border-t border-white/5 text-[9px] md:text-[10px]">
                              {item.gallery?.length > 0 && (
                                <span className="bg-white/5 px-1.5 md:px-2 py-0.5 md:py-1 rounded text-slate-400 flex items-center gap-0.5 md:gap-1"><FaImages className="text-[8px] md:text-xs" /> {item.gallery.length}</span>
                              )}
                              {item.tags && Array.isArray(item.tags) && item.tags.slice(0,1).map((t, idx) => (
                                <span key={idx} className="bg-accent/5 text-accent px-1.5 md:px-2 py-0.5 md:py-1 rounded border border-accent/10 truncate">#{t}</span>
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

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowModal(false)} />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 50 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 50 }} transition={{ type: "spring", duration: 0.5 }} className="relative w-full max-w-4xl bg-slate-900 border border-white/10 rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col mx-4 md:mx-0">
              <div className="px-4 md:px-8 py-4 md:py-6 border-b border-white/5 flex justify-between items-center bg-slate-900 z-10">
                <h3 className="text-lg md:text-xl font-bold text-white tracking-tight flex items-center gap-2">
                  <span className="w-2 h-5 md:h-6 bg-accent rounded-full mr-1 md:mr-2"/>
                  <span className="text-sm md:text-base">{editingItem ? `Edit ${activeTab.slice(0,-1)}` : `Create New ${activeTab.slice(0,-1)}`}</span>
                </h3>
                <button onClick={() => setShowModal(false)} className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 text-slate-400 hover:bg-red-500 hover:text-white transition"><FaTimes /></button>
              </div>
              <div className="p-4 md:p-8 overflow-y-auto custom-scrollbar bg-gradient-to-b from-slate-900 to-slate-950">
                <form id="itemForm" onSubmit={handleSave} className="space-y-6 md:space-y-10">
                  <div className="grid md:grid-cols-3 gap-4 md:gap-8">
                      <div className="md:col-span-2 space-y-4 md:space-y-6">
                         <div className="grid md:grid-cols-2 gap-3 md:gap-6">
                            <InputGroup label="Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required placeholder="Enter title..." />
                            {activeTab === 'projects' && (
                               <InputGroup label="Slug (Auto-generated)" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} placeholder="url-slug-here" />
                            )}
                         </div>
                         {activeTab === 'projects' && (
                            <div className="space-y-1 md:space-y-2 w-full">
                              <label className="text-[9px] md:text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Project Sector</label>
                              <select 
                                value={formData.category || 'General'}
                                onChange={e => setFormData({...formData, category: e.target.value})}
                                className="w-full bg-black/20 border border-white/10 rounded-lg md:rounded-2xl px-3 md:px-5 py-2 md:py-3 text-sm text-white focus:border-accent focus:bg-slate-900/50 outline-none transition-all cursor-pointer h-10 md:h-12"
                              >
                                <option value="General">General</option>
                                <option value="Medical">Medical</option>
                                <option value="E-Commerce">E-Commerce</option>
                                <option value="Restaurant">Restaurant</option>
                                <option value="Corporate">Corporate</option>
                                <option value="Education">Education</option>
                                <option value="Real Estate">Real Estate</option>
                              </select>
                            </div>
                         )}
                         <InputGroup label="Short Description" isTextArea value={formData.description || formData.shortDescription} onChange={e => setFormData({...formData, [activeTab === 'projects' ? 'description' : 'shortDescription']: e.target.value})} placeholder="Brief summary..." />
                      </div>
                      <div className="md:col-span-1">
                         <UploadBox label={activeTab === 'services' ? "Icon" : "Cover Image"} preview={activeTab === 'services' ? formData.icon : formData.image} onChange={(e) => handleUpload(e, activeTab === 'services' ? 'icon' : 'image')} loading={isUploading} onRemove={activeTab === 'services' ? () => removeImageField('icon') : () => removeImageField('image')} isIcon={activeTab === 'services'} />
                      </div>
                  </div>
                  <div className="space-y-4 md:space-y-6 pt-4 md:pt-6 border-t border-white/5">
                      <h4 className="text-xs font-bold text-accent uppercase tracking-wider">Content & Media</h4>
                      <div className="space-y-2">
                         <label className="text-xs font-bold text-slate-500 uppercase">Detailed Content (Markdown)</label>
                         <textarea rows="5" md:rows="8" className="w-full bg-black/20 border border-white/10 rounded-xl md:rounded-2xl px-4 md:px-5 py-3 md:py-4 text-sm text-white focus:border-accent outline-none font-mono leading-relaxed" value={formData.content || formData.fullContent || ''} onChange={e => setFormData({...formData, [activeTab === 'projects' ? 'content' : 'fullContent']: e.target.value})} placeholder="# Write your content here..." />
                      </div>
                      {activeTab === 'services' ? (
                         <div className="max-w-md">
                            <UploadBox label="Hero Image (Wide)" preview={formData.image} onChange={(e) => handleUpload(e, 'image')} loading={isUploading} onRemove={() => removeImageField('image')} />
                         </div>
                      ) : (
                         <div>
                            <UploadBox label="Project Gallery" isGallery gallery={formData.gallery} onChange={handleGalleryUpload} loading={isUploading} onRemoveGallery={removeGalleryImage} multiple />
                         </div>
                      )}
                      {activeTab === 'projects' && (
                         <div className="grid md:grid-cols-2 gap-3 md:gap-6 pt-2 md:pt-4">
                            <InputGroup label="External Link" value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} placeholder="https://..." />
                            <InputGroup label="Tags (Comma separated)" value={Array.isArray(formData.tags) ? formData.tags.join(', ') : formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} placeholder="React, API, Design" />
                         </div>
                      )}
                  </div>
                </form>
              </div>
              <div className="p-4 md:p-6 border-t border-white/5 bg-slate-900 flex justify-end gap-2 md:gap-4 z-20">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 md:px-6 py-2.5 md:py-3 rounded-lg md:rounded-xl text-slate-400 hover:text-white transition font-bold text-sm">Cancel</button>
                <button type="submit" form="itemForm" className="btn-primary px-6 md:px-10 py-2.5 md:py-3 rounded-lg md:rounded-xl shadow-xl shadow-accent/20 hover:shadow-accent/40 font-bold text-sm tracking-wide">{editingItem ? 'SAVE' : 'PUBLISH'}</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <Footer />
    </div>
  )
}

const EmptyState = () => (
  <div className="col-span-full flex flex-col items-center justify-center py-20 text-center opacity-50">
     <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mb-4"><FaSearch className="text-4xl text-slate-600" /></div>
     <h3 className="text-xl font-bold text-white">No items found</h3>
     <p className="text-slate-400">Try adjusting your search or add a new item.</p>
  </div>
)

const InputGroup = ({ label, value, onChange, required, placeholder, isTextArea }) => (
  <div className="space-y-1 md:space-y-2 w-full">
    <label className="text-[9px] md:text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">{label}</label>
    {isTextArea ? (
       <textarea rows="3" className="w-full bg-black/20 border border-white/10 rounded-lg md:rounded-2xl px-3 md:px-5 py-2 md:py-3 text-sm text-white focus:border-accent focus:bg-slate-900/50 outline-none transition-all placeholder-slate-700 resize-none" value={value || ''} onChange={onChange} required={required} placeholder={placeholder} />
    ) : (
       <input className="w-full bg-black/20 border border-white/10 rounded-lg md:rounded-2xl px-3 md:px-5 py-2 md:py-3 text-sm text-white focus:border-accent focus:bg-slate-900/50 outline-none transition-all placeholder-slate-700 h-10 md:h-12" value={value || ''} onChange={onChange} required={required} placeholder={placeholder} />
    )}
  </div>
)

// Helper component for uploading files

const UploadBox = ({ label, loading, onChange, multiple, preview, isGallery, gallery, onRemove, onRemoveGallery, isIcon }) => (
  <div className="space-y-1 md:space-y-2 h-full flex flex-col">
    <div className="flex justify-between items-center px-1">
       <label className="text-[9px] md:text-[10px] font-bold text-slate-500 uppercase tracking-wider">{label}</label>
       {loading && <span className="text-[9px] md:text-[10px] text-accent animate-pulse font-bold">UPLOADING...</span>}
    </div>
    {!isGallery ? (
       <div className={`relative flex-1 border-2 border-dashed border-white/10 rounded-lg md:rounded-2xl overflow-hidden hover:border-accent/40 transition-all group bg-black/20 min-h-[120px] md:min-h-[160px] ${preview ? 'border-solid border-white/5' : ''}`}>
          <input type="file" multiple={multiple} className="absolute inset-0 opacity-0 cursor-pointer z-20" onChange={onChange} disabled={loading} />
          {preview ? (
             <div className="absolute inset-0 z-10">
                <img src={preview} alt="Preview" className={`w-full h-full ${isIcon ? 'object-contain p-6 md:p-8' : 'object-cover'}`} />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 md:gap-2">
                   <span className="text-white text-xs font-bold">Change Image</span>
                   <button onClick={(e) => { e.preventDefault(); onRemove?.() }} className="px-2 md:px-3 py-0.5 md:py-1 bg-red-500/80 hover:bg-red-500 text-white text-[9px] md:text-[10px] rounded z-30 relative">Remove</button>
                </div>
             </div>
          ) : (
             <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <div className="w-10 md:w-12 h-10 md:h-12 rounded-full bg-slate-800 flex items-center justify-center mb-1 md:mb-2 group-hover:scale-110 transition-transform"><FaCloudUploadAlt className="text-lg md:text-xl text-slate-400" /></div>
                <span className="text-[9px] md:text-xs text-slate-500 font-bold">Drop image here</span>
             </div>
          )}
       </div>
    ) : (
       <div className="space-y-2 md:space-y-3">
          <div className="relative border-2 border-dashed border-white/10 rounded-lg md:rounded-2xl p-4 md:p-6 text-center hover:border-accent/40 transition-all bg-black/20 group cursor-pointer">
             <input type="file" multiple className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={onChange} disabled={loading} />
             <div className="pointer-events-none">
                <FaImages className="mx-auto text-xl md:text-2xl text-slate-500 mb-1 md:mb-2 group-hover:text-white transition-colors" />
                <span className="text-[9px] md:text-xs text-slate-400 font-bold block">Add Images to Gallery</span>
             </div>
          </div>
          {gallery?.length > 0 && (
             <div className="grid grid-cols-3 md:grid-cols-4 gap-1 md:gap-2">
                {gallery.map((img, i) => (
                   <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-white/10 group">
                      <img src={typeof img === 'string' ? img : img.url} className="w-full h-full object-cover" alt="" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                         <button type="button" onClick={() => onRemoveGallery?.(i, img.public_id)} className="w-6 md:w-8 h-6 md:h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform"><FaTrash size={10} /></button>
                      </div>
                   </div>
                ))}
             </div>
          )}
       </div>
    )}
  </div>
)