import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FaProjectDiagram, FaLayerGroup, FaEnvelope, 
  FaPlus, FaTrash, FaEdit, FaSearch, FaTimes, FaCloudUploadAlt, 
  FaImages, FaClock, FaGlobe, FaUser, FaLink, FaTag, FaMagic
} from 'react-icons/fa'
import { logout } from '../services/auth'
import api, { API_URL } from '../services/api'
import axios from 'axios'
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
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState('newest')
  const [counts, setCounts] = useState({ projects: 0, services: 0, messages: 0 })
  
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [toasts, setToasts] = useState([])
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null })
  
  const [formData, setFormData] = useState({}) 
  const [isUploading, setIsUploading] = useState(false)
  const [selectedItems, setSelectedItems] = useState(new Set())

  useEffect(() => {
    // Use updated token storage key (accessToken) and fallback to refresh token
    const access = localStorage.getItem('accessToken')
    const refresh = localStorage.getItem('refreshToken')
    if (!access && !refresh) {
      navigate('/admin/login')
      return
    }
    fetchData()
    fetchCounts()
  }, [activeTab, navigate])

  const fetchCounts = async () => {
    try {
      const [projRes, svcRes, msgRes] = await Promise.all([
        api.get('/api/projects').catch(() => ({ data: [] })),
        api.get('/api/services').catch(() => ({ data: [] })),
        api.get('/api/messages').catch(async (err) => {
          // If unauthorized, try public messages list
          if (err?.response?.status === 401) {
            try {
              const publicRes = await axios.get(`${API_URL}/messages/public`)
              return publicRes
            } catch (e) {
              return { data: [] }
            }
          }
          return { data: [] }
        }),
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
      let res
      try {
        res = await api.get(`/api/${activeTab}`)
      } catch (err) {
        // If messages endpoint is unauthorized, try public listing
        if (activeTab === 'messages' && err?.response?.status === 401) {
          const publicRes = await axios.get(`${API_URL}/messages/public`)
          res = publicRes
        } else {
          throw err
        }
      }
      let data = [];
      if (Array.isArray(res.data)) {
        data = res.data;
      } else if (res.data && Array.isArray(res.data.items)) {
        data = res.data.items;
      }
      
      // Log categories info
      if (activeTab === 'projects') {
        console.log(`📊 Projects fetched: ${data.length}`);
        const categories = {};
        data.forEach(p => {
          const cat = p.category || 'No Category';
          categories[cat] = (categories[cat] || 0) + 1;
        });
        console.log('📁 Categories breakdown:', categories);
      }
      
      setItems(data);
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
    // Allow viewing messages (item provided) but prevent creating new message
    if (activeTab === 'messages' && !item) return;
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
      // For services and messages we set appropriate form data
      if (activeTab === 'messages') {
        setFormData(item || { name: '', email: '', subject: '', message: '', date: '' })
      } else {
        setFormData(item || { title: '', shortDescription: '', fullContent: '', icon: '', image: '' })
      }
    }
    setShowModal(true)
  }

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      // Validation
      if (!formData.title || !formData.title.trim()) {
        addToast('error', 'Title is required');
        return;
      }
      
      if (activeTab === 'projects' && (!formData.slug || !formData.slug.trim())) {
        addToast('error', 'Slug is required for projects');
        return;
      }
      
      // Check for incomplete uploads
      if (isUploading) {
        addToast('error', 'Please wait for uploads to complete');
        return;
      }
      
      if (activeTab === 'projects' && formData.gallery?.some(g => g.__temp)) {
        addToast('error', 'Please wait for all images to upload');
        return;
      }
      
      const dataToSend = { ...formData };
      
      if (!editingItem) {
        delete dataToSend.id;
        delete dataToSend.createdAt;
        delete dataToSend.updatedAt;
      }
      
      // Clean up temp markers
      delete dataToSend.imageTemp;
      delete dataToSend.iconTemp;
      delete dataToSend.imagePublicId;
      delete dataToSend.iconPublicId;

      if (activeTab === 'projects') {
        // Ensure category is always included
        if (!dataToSend.category || dataToSend.category.trim() === '') {
          dataToSend.category = 'General';
        }

        // Process tags
        if (typeof dataToSend.tags === 'string') {
          dataToSend.tags = dataToSend.tags.split(',').map(t => t.trim()).filter(t => t !== '');
        }
        
        // Auto-generate slug if needed
        if (!dataToSend.slug && dataToSend.title) {
          dataToSend.slug = String(dataToSend.title).toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-_]/g, '');
        }
        
        // Process gallery - only keep URLs
        if (Array.isArray(dataToSend.gallery)) {
          dataToSend.gallery = dataToSend.gallery
            .filter(g => g && (typeof g === 'string' || g.url))
            .map(g => (typeof g === 'string' ? g : g.url));
        } else {
          dataToSend.gallery = [];
        }
      }

      console.log('📤 Sending data to server:', {
        action: editingItem ? 'UPDATE' : 'CREATE',
        endpoint: `/${activeTab}/${editingItem?.id || 'new'}`,
        data: dataToSend,
        category: dataToSend.category,
        categoryType: typeof dataToSend.category,
        timestamp: new Date().toISOString()
      });

      if (editingItem) {
        const updatedRes = await api.put(`/api/${activeTab}/${editingItem.id}`, dataToSend);
        console.log('✅ Server UPDATE response:', updatedRes.data);
        addToast('success', 'Updated successfully!');
      } else {
        const createdRes = await api.post(`/api/${activeTab}`, dataToSend);
        console.log('✅ Server CREATE response:', createdRes.data);
        addToast('success', 'Created successfully!');
      }
      
      setShowModal(false);
      setFormData({});
      // Refresh data to verify changes were saved
      console.log('🔄 Refreshing data from server...');
      await fetchData();
      console.log('✅ Data refreshed');
    } catch (err) {
      console.error("❌ Save Error Details:", {
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        headers: err.config?.headers,
        endpoint: `/api/${activeTab}/${editingItem?.id || 'new'}`,
        fullError: err
      });
      let errorMsg = 'Operation failed. Please try again.';
      if (err.response?.status === 401) {
        errorMsg = '⚠️ Not authorized. Please log in again.';
      } else if (err.response?.status === 403) {
        errorMsg = '⚠️ You don\'t have permission to perform this action.';
      } else if (err.response?.status === 400) {
        errorMsg = `❌ Validation error: ${err.response?.data?.error || 'Invalid data'}`;
      } else if (err.response?.status === 404) {
        errorMsg = '❌ Item not found. It may have been deleted.';
      } else if (err.response?.status === 500) {
        errorMsg = '❌ Server error. Please try again later.';
      } else {
        errorMsg = err.response?.data?.error || err.response?.data?.details || err.message || errorMsg;
      }
      addToast('error', errorMsg);
    }
  }

  const handleDelete = async () => {
    try {
      console.log('🗑️ Attempting to delete:', `/api/${activeTab}/${confirmDelete.id}`);
      const res = await api.delete(`/api/${activeTab}/${confirmDelete.id}`);
      console.log('✅ Delete response:', res.data);
      addToast('success', 'Deleted successfully');
      setConfirmDelete({ open: false, id: null });
      await fetchData();
    } catch (err) {
      console.error('❌ Delete Error:', {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
        endpoint: `/api/${activeTab}/${confirmDelete.id}`,
        fullError: err
      });
      const errorMsg = err.response?.status === 401 
        ? '⚠️ Not authorized. Please log in again.'
        : err.response?.data?.error || err.response?.data?.message || 'Delete failed. Please try again.';
      addToast('error', errorMsg);
    }
  }

  // --- منطق رفع الصور مع Validation قوية ---
  const validateFile = (file) => {
    const MAX_SIZE = 5 * 1024 * 1024;
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    
    if (!file) return { valid: false, error: 'No file selected' };
    if (file.size > MAX_SIZE) return { valid: false, error: 'File must be less than 5MB' };
    if (!ALLOWED_TYPES.includes(file.type)) {
      return { valid: false, error: 'Only JPG, PNG, WebP, GIF allowed' };
    }
    return { valid: true };
  };

  const handleUpload = async (e, field) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const validation = validateFile(file);
    if (!validation.valid) {
      addToast('error', validation.error);
      e.target.value = '';
      return;
    }
    
    const localUrl = URL.createObjectURL(file);
    setFormData(prev => ({ ...prev, [field]: localUrl, [`${field}Temp`]: true }));
    setIsUploading(true);
    
    try {
      const fd = new FormData();
      fd.append('files', file);
      
      const res = await api.post('/api/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 30000
      });
      
      if (!res.data?.uploaded?.[0]) {
        throw new Error('Invalid upload response');
      }
      
      const uploaded = res.data.uploaded[0];
      setFormData(prev => ({
        ...prev,
        [field]: uploaded.url,
        [`${field}PublicId`]: uploaded.public_id,
        [`${field}Temp`]: false
      }));
      addToast('success', 'Image uploaded successfully');
    } catch (err) {
      console.error(`Upload failed for ${field}:`, err);
      setFormData(prev => ({ ...prev, [field]: null, [`${field}Temp`]: false }));
      const errorMsg = err.response?.data?.error || 'Upload failed. Please try again.';
      addToast('error', errorMsg);
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    
    const invalidFiles = files.filter(f => !validateFile(f).valid);
    if (invalidFiles.length > 0) {
      addToast('error', `${invalidFiles.length} file(s) invalid or too large`);
      e.target.value = '';
      return;
    }
    
    setIsUploading(true);
    const tempEntries = files.map(f => ({
      url: URL.createObjectURL(f),
      public_id: null,
      __temp: true
    }));
    
    setFormData(prev => ({
      ...prev,
      gallery: [...(prev.gallery || []), ...tempEntries]
    }));
    
    const fd = new FormData();
    files.forEach(f => fd.append('files', f));
    
    try {
      const res = await api.post('/api/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 60000
      });
      
      if (!Array.isArray(res.data?.uploaded)) {
        throw new Error('Invalid upload response');
      }
      
      const uploaded = res.data.uploaded;
      setFormData(prev => {
        const g = prev.gallery ? [...prev.gallery] : [];
        const replaceStart = Math.max(0, g.length - tempEntries.length);
        
        for (let i = 0; i < uploaded.length && i < tempEntries.length; i++) {
          if (g[replaceStart + i]) {
            g[replaceStart + i] = {
              url: uploaded[i].url,
              public_id: uploaded[i].public_id
            };
          }
        }
        return { ...prev, gallery: g };
      });
      addToast('success', `${uploaded.length} image(s) added`);
    } catch (err) {
      console.error('Gallery upload error:', err);
      setFormData(prev => ({
        ...prev,
        gallery: prev.gallery ? prev.gallery.filter(g => !g.__temp) : []
      }));
      const errorMsg = err.response?.data?.error || 'Gallery upload failed';
      addToast('error', errorMsg);
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
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
  
  // Advanced filtering and sorting
  const filteredItems = safeItems
    .filter(i => {
      const search = searchTerm.toLowerCase();
      const matchesSearch = (i.title?.toLowerCase().includes(search)) || 
                           (i.description?.toLowerCase().includes(search)) ||
                           (i.category?.toLowerCase().includes(search));
      
      if (activeTab === 'projects') {
        const matchesCategory = selectedCategory === 'All' || i.category === selectedCategory;
        return matchesSearch && matchesCategory;
      }
      return matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === 'title-asc') return (a.title || '').localeCompare(b.title || '');
      if (sortBy === 'title-desc') return (b.title || '').localeCompare(a.title || '');
      return 0;
    });
  
  const selectItem = (id) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };
  
  const selectAllVisible = () => {
    const newSelected = new Set();
    filteredItems.forEach(item => newSelected.add(item.id));
    setSelectedItems(newSelected);
  };
  
  const clearSelection = () => {
    setSelectedItems(new Set());
  };
  
  const deleteSelected = async () => {
    if (selectedItems.size === 0) return;
    const confirmed = window.confirm(`Delete ${selectedItems.size} item(s)?`);
    if (!confirmed) return;
    
    try {
      let failed = 0;
      let succeeded = 0;
      for (const id of selectedItems) {
        try {
          console.log(`🗑️ Deleting item ${id}...`);
          await api.delete(`/api/${activeTab}/${id}`);
          succeeded++;
        } catch (itemErr) {
          console.error(`❌ Failed to delete item ${id}:`, itemErr.response?.data || itemErr.message);
          failed++;
        }
      }
      if (failed > 0) {
        addToast('warning', `Deleted ${succeeded} item(s), failed to delete ${failed}`);
      } else {
        addToast('success', `Deleted ${succeeded} item(s)`);
      }
      setSelectedItems(new Set());
      await fetchData();
    } catch (err) {
      console.error('❌ Bulk delete error:', err);
      const errorMsg = err.response?.status === 401 
        ? '⚠️ Not authorized. Please log in again.'
        : 'Failed to delete some items. Please try again.';
      addToast('error', errorMsg);
    }
  };

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
          <header className="px-4 sm:px-6 py-4 sm:py-6 border-b border-white/5 bg-slate-900/20 backdrop-blur-md">
            <div className="flex flex-col gap-4">
              {/* Title + Action Buttons */}
              <div className="flex flex-col sm:flex-row sm:flex-wrap justify-between items-start sm:items-center gap-3 sm:gap-4">
                <div className="min-w-0 flex-1">
                  <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight capitalize truncate">{activeTab}</h1>
                  <p className="text-xs text-slate-500 font-mono mt-1">Manage your {activeTab} content</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedItems.size > 0 && (
                    <>
                      <span className="text-xs text-slate-400 px-3 py-2">{selectedItems.size} selected</span>
                      <button onClick={clearSelection} className="text-xs px-3 py-2 bg-white/5 rounded-lg hover:bg-white/10 text-slate-300">Clear</button>
                      <button onClick={deleteSelected} className="text-xs px-3 py-2 bg-red-600 rounded-lg text-white hover:bg-red-700">Delete All</button>
                    </>
                  )}
                  {activeTab !== 'messages' && (
                    <button onClick={() => openModal()} className="btn-primary flex items-center gap-2 px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-lg hover:-translate-y-1 transition-all whitespace-nowrap">
                      <FaPlus /> <span>New Item</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Advanced Filters */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/5">
                {/* Search */}
                <div className="flex-1 relative">
                  <FaSearch className="absolute left-3 top-3 text-slate-500 text-xs" />
                  <input 
                    type="text"
                    placeholder="Search by title, description, or category..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 pl-7 text-xs text-white placeholder-slate-500 focus:border-accent outline-none"
                  />
                </div>

                {/* Category Filter (Projects only) */}
                {activeTab === 'projects' && (
                  <select 
                    value={selectedCategory}
                    onChange={e => setSelectedCategory(e.target.value)}
                    className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-accent outline-none cursor-pointer"
                  >
                    <option value="All">All Categories</option>
                    {SECTORS.map(sec => <option key={sec} value={sec}>{sec}</option>)}
                  </select>
                )}

                {/* Sort */}
                <select 
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-accent outline-none cursor-pointer"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="title-asc">Title (A-Z)</option>
                  <option value="title-desc">Title (Z-A)</option>
                </select>

                {/* Results Count */}
                <div className="text-xs text-slate-400 px-3 py-2 whitespace-nowrap">
                  {filteredItems.length} of {safeItems.length}
                </div>

                {/* Select All Visible (Projects only) */}
                {activeTab === 'projects' && filteredItems.length > 0 && (
                  <button 
                    onClick={selectAllVisible}
                    className="text-xs px-3 py-2 bg-white/5 rounded-lg hover:bg-white/10 text-slate-300 whitespace-nowrap"
                  >
                    Select All ({filteredItems.length})
                  </button>
                )}
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto px-6 py-8 custom-scrollbar pb-24">
            {/* Project List */}
            {loading ? (
              <div className="h-64 flex items-center justify-center"><Spinner /></div>
            ) : (
              <motion.div layout>
                {activeTab === 'projects' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    <AnimatePresence>
                      {filteredItems.map((item, i) => (
                        <motion.div 
                          key={item.id}
                          layout
                          className="group relative bg-slate-900/40 backdrop-blur-sm border border-white/5 rounded-3xl overflow-hidden hover:border-accent/30 hover:shadow-2xl hover:shadow-accent/5 transition-all duration-500 flex flex-col"
                        >
                          {/* Checkbox (top-left) */}
                          <div className="absolute top-3 left-3 z-10">
                            <input 
                              type="checkbox"
                              checked={selectedItems.has(item.id)}
                              onChange={() => selectItem(item.id)}
                              className="w-4 h-4 accent-accent cursor-pointer"
                            />
                          </div>

                          {/* Image */}
                          <div className="h-48 overflow-hidden relative bg-slate-950">
                             <img src={item.image || item.icon} onError={(e) => { e.target.src = FALLBACK_SVG }} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100" />
                             {/* Actions */}
                             <div className="absolute top-4 right-4 flex gap-2 translate-y-[-10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                               <button onClick={() => openModal(item)} className="p-2 bg-white/10 backdrop-blur-md rounded-xl text-white hover:bg-accent hover:text-black transition-colors shadow-lg"><FaEdit /></button>
                               <button onClick={() => setConfirmDelete({ open: true, id: item.id })} className="p-2 bg-black/40 backdrop-blur-md rounded-xl text-red-400 hover:bg-red-500 hover:text-white transition-colors shadow-lg"><FaTrash /></button>
                             </div>
                             {/* Badge */}
                             <span className="absolute top-4 left-14 bg-black/50 backdrop-blur-md text-[10px] font-bold px-2 py-1 rounded text-white border border-white/5">
                                {item.category || 'Uncategorized'}
                             </span>
                          </div>
                          {/* Info */}
                          <div className="p-5 flex-1 flex flex-col">
                            <h3 className="font-bold text-white text-lg truncate mb-2">{item.title}</h3>
                            <p className="text-xs text-slate-400 line-clamp-2 mb-4 flex-1">{item.description}</p>
                            <p className="text-[10px] text-slate-500 font-mono">{new Date(item.createdAt).toLocaleDateString()}</p>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
                {/* Services view (simple grid) */}
                {activeTab === 'services' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    <AnimatePresence>
                      {filteredItems.map((item) => (
                        <motion.div key={item.id} layout className="group relative bg-slate-900/40 backdrop-blur-sm border border-white/5 rounded-3xl overflow-hidden hover:border-accent/30 hover:shadow-2xl transition-all duration-500 flex flex-col">
                          <div className="h-40 overflow-hidden relative bg-slate-950">
                            <img src={item.image || item.icon} onError={(e) => { e.target.src = FALLBACK_SVG }} className="w-full h-full object-cover" />
                          </div>
                          <div className="p-4 flex-1">
                            <h3 className="font-bold text-white truncate mb-1">{item.title}</h3>
                            <p className="text-xs text-slate-400 line-clamp-2">{item.shortDescription}</p>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}

                {/* Messages view (list) */}
                {activeTab === 'messages' && (
                  <div className="space-y-4">
                    {filteredItems.length === 0 && (
                      <div className="text-slate-400 text-sm">No messages found.</div>
                    )}
                    <div className="space-y-3">
                      {filteredItems.map(msg => (
                        <div key={msg.id} className="bg-slate-900/40 border border-white/5 rounded-xl p-4 flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <h4 className="font-bold text-white">{msg.name} <span className="text-xs text-slate-400 font-mono">{msg.email}</span></h4>
                                <p className="text-sm text-slate-300 mt-1">{msg.subject || 'No subject'}</p>
                              </div>
                              <div className="text-xs text-slate-500">{new Date(msg.createdAt).toLocaleString()}</div>
                            </div>
                            <p className="text-slate-400 text-sm mt-3 line-clamp-3">{msg.message}</p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <button onClick={() => openModal(msg)} className="px-3 py-2 bg-white/5 rounded-lg text-xs font-bold hover:bg-white/10">View</button>
                            <button onClick={() => setConfirmDelete({ open: true, id: msg.id })} className="px-3 py-2 bg-red-600 rounded-lg text-xs font-bold hover:bg-red-700">Delete</button>
                            <a href={`mailto:${msg.email}?subject=Re:%20${encodeURIComponent(msg.subject||'')}`} className="text-xs text-accent mt-2">Reply</a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 50 }} animate={{ scale: 1, opacity: 1, y: 0 }} className="relative w-full h-[calc(100vh-40px)] sm:h-auto sm:max-h-[90vh] md:max-w-4xl bg-slate-900 border border-white/10 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col m-5 sm:m-0">
              
              {/* Header */}
              <div className="px-4 sm:px-8 py-4 sm:py-6 border-b border-white/5 flex justify-between items-center bg-slate-900/95 backdrop-blur-sm z-10 gap-2">
                <h3 className="text-lg sm:text-xl font-bold text-white flex-1 truncate">
                  {editingItem ? `Edit ${activeTab.slice(0,-1)}` : `Create New ${activeTab.slice(0,-1)}`}
                </h3>
                <button onClick={() => setShowModal(false)} className="flex-shrink-0"><FaTimes className="text-slate-400 hover:text-white" /></button>
              </div>

              {/* Form */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 md:p-8">
                {activeTab === 'messages' ? (
                  <div className="space-y-4">
                    <div className="bg-slate-900/40 border border-white/5 rounded-xl p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-bold text-white">{formData.name}</h3>
                          <p className="text-xs text-slate-400 font-mono">{formData.email}</p>
                          <p className="text-sm text-slate-300 mt-2 font-semibold">{formData.subject || 'No subject'}</p>
                        </div>
                        <div className="text-xs text-slate-500">{formData.date ? new Date(formData.date).toLocaleString() : ''}</div>
                      </div>
                      <div className="mt-4 text-slate-200 whitespace-pre-wrap">{formData.message}</div>
                      <div className="mt-6 flex justify-end gap-2">
                        <button onClick={() => { setConfirmDelete({ open: true, id: editingItem?.id }); setShowModal(false); }} className="px-4 py-2 bg-red-600 rounded-lg text-sm font-bold">Delete</button>
                        <a href={`mailto:${formData.email}?subject=Re:%20${encodeURIComponent(formData.subject||'')}`} className="px-4 py-2 bg-white/5 rounded-lg text-sm font-bold text-accent">Reply</a>
                      </div>
                    </div>
                  </div>
                ) : (
                  <form id="itemForm" onSubmit={handleSave} className="space-y-6 sm:space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                      {/* Left: Text Inputs */}
                      <div className="md:col-span-2 space-y-6">
                        <InputGroup label="Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required placeholder="Enter title..." />
                        {activeTab === 'projects' && (
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1 block">Project Sector (Category)</label>
                            <select 
                              value={formData.category || 'General'}
                              onChange={e => setFormData({...formData, category: e.target.value})}
                              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-accent outline-none cursor-pointer"
                            >
                              <option value="General">General (Uncategorized)</option>
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
                )}
              </div>

              {/* Footer */}
              <div className="p-4 sm:p-6 border-t border-white/5 bg-slate-900 flex justify-end gap-2 sm:gap-4 z-20 flex-wrap">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 sm:px-6 py-2 sm:py-3 rounded-xl text-slate-300 hover:text-white font-bold text-xs sm:text-sm">Cancel</button>
                <button type="submit" form="itemForm" className="btn-primary px-6 sm:px-8 py-2 sm:py-3 rounded-xl shadow-xl font-bold text-xs sm:text-sm">
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

const UploadBox = ({ label, loading, onChange, multiple, preview, isGallery, gallery, onRemove, onRemoveGallery }) => {
  const [dragActive, setDragActive] = React.useState(false);
  
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files) {
      onChange({ target: { files: e.dataTransfer.files } });
    }
  };
  
  return (
    <div className="space-y-2 h-full flex flex-col">
      <div className="flex justify-between items-center px-1">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</label>
        {loading && (
          <span className="text-xs text-amber-400 animate-pulse font-bold flex items-center gap-1">
            <FaCloudUploadAlt size={10} />UPLOADING...
          </span>
        )}
      </div>
      
      {!isGallery ? (
        <div 
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`relative flex-1 border-2 border-dashed rounded-xl overflow-hidden transition-all bg-black/30 min-h-[150px] flex items-center justify-center group ${
            dragActive 
              ? 'border-accent bg-accent/5' 
              : preview 
              ? 'border-white/5' 
              : 'border-white/10 hover:border-accent/40'
          }`}
        >
          <input 
            type="file" 
            accept="image/jpeg,image/png,image/webp,image/gif" 
            className="absolute inset-0 opacity-0 cursor-pointer z-20" 
            onChange={onChange} 
            disabled={loading}
            aria-label={label}
          />
          {preview ? (
            <div className="absolute inset-0 z-10 flex items-center justify-center">
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button 
                  type="button"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); onRemove(); }} 
                  className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1.5 rounded-lg font-bold transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-slate-500 gap-2">
              <FaCloudUploadAlt className="text-3xl text-slate-600 group-hover:text-accent transition-colors" />
              <div className="text-xs font-bold text-center">
                <p>Drag & drop or click</p>
                <p className="text-slate-600 text-[10px] mt-1">JPG, PNG, WebP, GIF (max 5MB)</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <div 
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all bg-black/30 group cursor-pointer ${
              dragActive 
                ? 'border-accent bg-accent/5' 
                : 'border-white/10 hover:border-accent/40'
            }`}
          >
            <input 
              type="file" 
              multiple 
              accept="image/jpeg,image/png,image/webp,image/gif" 
              className="absolute inset-0 opacity-0 cursor-pointer z-10" 
              onChange={onChange}
              disabled={loading}
              aria-label={label}
            />
            <FaImages className={`mx-auto text-2xl transition-colors ${
              dragActive ? 'text-accent' : 'text-slate-500 group-hover:text-slate-400'
            }`} />
            <p className="text-xs text-slate-400 mt-2 pointer-events-none">Add images to gallery</p>
          </div>
          
          {gallery?.length > 0 && (
            <div className="space-y-2">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                {gallery.length} image(s)
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                {gallery.map((img, i) => (
                  <div 
                    key={i} 
                    className="relative aspect-square rounded-lg overflow-hidden border border-white/5 group/img hover:border-accent/50 transition-colors"
                  >
                    <img 
                      src={typeof img === 'string' ? img : img.url} 
                      alt={`Gallery ${i + 1}`} 
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <button 
                      type="button" 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onRemoveGallery(i);
                      }} 
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-red-400 hover:text-red-300"
                      title="Remove"
                    >
                      <FaTrash size={14} />
                    </button>
                    <span className="absolute bottom-1 left-1 bg-black/80 text-white text-[9px] px-1.5 py-0.5 rounded pointer-events-none font-bold">
                      {img.__temp ? '↑' : '✓'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}