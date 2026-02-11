const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
// التصحيح: استيراد requireAuth بدلاً من requireAdmin (لأننا وحدنا الميدلوير)
const { requireAuth } = require('../middleware/auth'); 

// 1. جلب كل الخدمات (عام)
router.get('/', async (req, res) => {
  try {
    // إضافة caching headers للـ public endpoints
    res.set('Cache-Control', 'public, max-age=300'); // 5 دقائق caching
    
    const cols = await require('../utils/dbMeta').getTableColumns('Service');

    const select = {
      id: true,
      title: true,
      shortDescription: true,
      icon: true,
      image: true
    };

    if (cols.has('titleAr')) select.titleAr = true;
    if (cols.has('shortDescriptionAr')) select.shortDescriptionAr = true;

    const services = await prisma.service.findMany({
      orderBy: { id: 'asc' },
      select
    });
    res.json(services);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

// 2. جلب خدمة واحدة (عام)
router.get('/:id', async (req, res) => {
  try {
    res.set('Cache-Control', 'public, max-age=300'); // 5 دقائق caching
    
    const id = parseInt(req.params.id);

    const cols = await require('../utils/dbMeta').getTableColumns('Service');

    const select = {
      id: true,
      title: true,
      shortDescription: true,
      fullContent: true,
      icon: true,
      image: true,
      features: true
    };

    if (cols.has('titleAr')) select.titleAr = true;
    if (cols.has('shortDescriptionAr')) select.shortDescriptionAr = true;
    if (cols.has('fullContentAr')) select.fullContentAr = true;
    if (cols.has('featuresAr')) select.featuresAr = true;

    const service = await prisma.service.findUnique({
      where: { id },
      select
    });
    
    if (!service) return res.status(404).json({ error: 'Service not found' });
    res.json(service);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch service' });
  }
});

// 3. إنشاء خدمة جديدة (محمي)
router.post('/', requireAuth, async (req, res) => {
  try {
    const { title, shortDescription, fullContent, icon, image } = req.body;
    
    const newService = await prisma.service.create({ 
      data: { 
        title, 
        shortDescription, 
        fullContent, 
        icon, 
        image 
      } 
    });
    res.status(201).json(newService);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create service' });
  }
});

// 4. تعديل خدمة (محمي)
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { title, shortDescription, fullContent, icon, image } = req.body;
    
    const updatedService = await prisma.service.update({ 
      where: { id }, 
      data: { 
        title, 
        shortDescription, 
        fullContent, 
        icon, 
        image 
      } 
    });
    res.json(updatedService);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update service' });
  }
});

// 5. حذف خدمة (محمي)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.service.delete({ where: { id } });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete service' });
  }
});

module.exports = router;