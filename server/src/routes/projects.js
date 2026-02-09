const express = require('express');
const router = express.Router();
const prisma = require('../utils/prisma'); // نستخدم نسخة Prisma المركزية
const { requireAuth } = require('../middleware/auth'); 

// --- دوال مساعدة (Helper Functions) ---
// تحويل النصوص (csv) إلى مصفوفات ليقبلها Prisma
const parseArray = (input) => {
  if (!input) return [];
  if (Array.isArray(input)) return input;
  if (typeof input === 'string') {
    return input.split(',').map(item => item.trim()).filter(item => item !== '');
  }
  return [];
};

// 1. جلب كل المشاريع (عام)
router.get('/', async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(projects);
  } catch (error) {
    console.error('GET /projects error:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// 2. جلب مشروع واحد عبر الـ Slug (عام)
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    
    // إذا كان الـ slug رقم (ID) بالخطأ، نحاول البحث بالـ ID
    const whereClause = isNaN(slug) ? { slug } : { id: parseInt(slug) };

    const project = await prisma.project.findFirst({
      where: whereClause
    });

    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project);
  } catch (error) {
    console.error('GET /:slug error:', error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// 3. إنشاء مشروع جديد (محمي) مع Validation أفضل
router.post('/', requireAuth, async (req, res) => {
  try {
    const { title, slug, description, content, image, link, category } = req.body;
    
    // Validation
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Title is required' });
    }
    if (!slug || !slug.trim()) {
      return res.status(400).json({ error: 'Slug is required' });
    }
    
    // Validate slug format
    const slugRegex = /^[a-z0-9-_]+$/;
    if (!slugRegex.test(slug)) {
      return res.status(400).json({ error: 'Slug must contain only lowercase letters, numbers, hyphens, and underscores' });
    }
    
    const tags = parseArray(req.body.tags);
    const gallery = parseArray(req.body.gallery);

    const newProject = await prisma.project.create({
      data: {
        title: title.trim(),
        slug: slug.trim(),
        description: description || '',
        content: content || '',
        image: image || '',
        link: link || '',
        category: category || 'General',
        tags,
        gallery
      }
    });

    res.status(201).json(newProject);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Slug already exists. Please use a unique slug.' });
    }
    console.error('Create Project Error:', error);
    res.status(500).json({ error: 'Failed to create project', details: error.message });
  }
});

// 4. تعديل مشروع (محمي) مع معالجة أفضل للأخطاء
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const parsedId = parseInt(id);
    
    // Validate ID
    if (isNaN(parsedId)) {
      return res.status(400).json({ error: 'Invalid project ID' });
    }

    const { title, slug, description, content, image, link, category } = req.body;

    // Validate inputs
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Title is required' });
    }
    if (!slug || !slug.trim()) {
      return res.status(400).json({ error: 'Slug is required' });
    }
    
    // Validate slug format
    const slugRegex = /^[a-z0-9-_]+$/;
    if (!slugRegex.test(slug.trim())) {
      return res.status(400).json({ error: 'Slug must contain only lowercase letters, numbers, hyphens, and underscores' });
    }

    const tags = parseArray(req.body.tags);
    const gallery = parseArray(req.body.gallery);

    console.log('🔍 Processing update request:', {
      id: parsedId,
      title,
      slug,
      tagsCount: tags.length,
      galleryCount: gallery.length,
      timestamp: new Date().toISOString()
    });

    // Check if project exists first
    const existingProject = await prisma.project.findUnique({
      where: { id: parsedId }
    });
    
    if (!existingProject) {
      console.warn(`⚠️  Project ${parsedId} not found for update`);
      return res.status(404).json({ error: 'Project not found' });
    }

    console.log('✅ Project found, proceeding with update...');

    const updateData = {
      title: title.trim(),
      slug: slug.trim(),
      description: description || '',
      content: content || '',
      image: image || '',
      link: link || '',
      category: category || 'General',
      tags: Array.isArray(tags) ? tags : [],
      gallery: Array.isArray(gallery) ? gallery : []
    };

    console.log('📝 Update data prepared:', {
      title: updateData.title,
      slug: updateData.slug,
      description: updateData.description.substring(0, 50),
      tagsArray: updateData.tags,
      galleryArray: updateData.gallery
    });

    const updatedProject = await prisma.project.update({
      where: { id: parsedId },
      data: updateData
    });
    
    console.log('✅ Project updated successfully:', updatedProject.id);
    res.json(updatedProject);
  } catch (error) {
    if (error.code === 'P2002') {
      console.warn('⚠️  Slug conflict:', error.meta);
      return res.status(400).json({ error: 'Slug is already taken by another project.' });
    }
    if (error.code === 'P2025') {
      console.warn('⚠️  Record not found for update');
      return res.status(404).json({ error: 'Project not found' });
    }
    console.error('🔥 Update Project Error:', {
      message: error.message,
      code: error.code,
      meta: error.meta,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    res.status(500).json({ 
      error: 'Failed to update project', 
      details: error.message,
      code: error.code 
    });
  }
});

// 5. حذف مشروع (محمي) مع معالجة أفضل للأخطاء
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) {
      return res.status(400).json({ error: 'Invalid project ID' });
    }
    
    await prisma.project.delete({
      where: { id: parsedId }
    });
    
    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Project not found' });
    }
    console.error('Delete Project Error:', error);
    res.status(500).json({ error: 'Failed to delete project', details: error.message });
  }
});

module.exports = router;