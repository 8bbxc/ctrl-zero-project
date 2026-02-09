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

// 3. إنشاء مشروع جديد (محمي)
router.post('/', requireAuth, async (req, res) => {
  try {
    const { title, slug, description, content, image, link, category } = req.body;
    
    // معالجة المصفوفات (Tags & Gallery) لتجنب الأخطاء
    const tags = parseArray(req.body.tags);
    const gallery = parseArray(req.body.gallery);

    // التحقق من الحقول الأساسية
    if (!title || !slug) {
        return res.status(400).json({ error: 'Title and Slug are required' });
    }

    const newProject = await prisma.project.create({
      data: {
        title,
        slug, // يجب أن يكون فريداً
        description: description || '',
        content: content || '',
        image: image || '',
        link: link || '',
        category: category || 'General', // Category with default value
        tags,    // الآن هي مصفوفة مضمونة
        gallery  // الآن هي مصفوفة مضمونة
      }
    });

    res.status(201).json(newProject);
  } catch (error) {
    // التعامل مع خطأ التكرار (Unique Constraint)
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Slug matches an existing project. Please use a unique slug.' });
    }
    console.error('Create Project Error:', error);
    res.status(500).json({ error: 'Failed to create project', details: error.message });
  }
});

// 4. تعديل مشروع (محمي)
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, slug, description, content, image, link, category } = req.body;

    const tags = parseArray(req.body.tags);
    const gallery = parseArray(req.body.gallery);

    const updatedProject = await prisma.project.update({
      where: { id: parseInt(id) },
      data: {
        title,
        slug,
        description,
        content,
        image,
        link,
        category: category || 'General', // Category with default value
        tags,
        gallery
      }
    });
    
    res.json(updatedProject);
  } catch (error) {
    if (error.code === 'P2002') {
        return res.status(400).json({ error: 'Slug is already taken by another project.' });
    }
    console.error('Update Project Error:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// 5. حذف مشروع (محمي)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.project.delete({
      where: { id: parseInt(id) }
    });
    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete Project Error:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

module.exports = router;