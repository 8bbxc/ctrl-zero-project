const { PrismaClient } = require('@prisma/client')
// Load environment variables (ensure ADMIN_* and DATABASE_URL are visible)
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') })
const fs = require('fs')
const path = require('path')

const prisma = new PrismaClient()

const projects = [
  {
    title: 'DevLens AI',
    slug: 'devlens-ai',
    description: 'Intelligent AI web application integrating Google Gemini API for deep analysis and interactive insights.',
    content: 'DevLens AI leverages the Gemini API to provide deep analysis and interactive insights for user inputs. Built with modern web stack for performance and scalability. Features real-time processing, semantic analysis, and intelligent recommendations.',
    image: 'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?auto=format&fit=crop&w=1200&q=80',
    images: [],
    gallery: [
      'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1400&q=80'
    ],
    url: '',
    category: 'Corporate',
    tags: ['Node.js','Express','React','Gemini API', 'AI']
  },
  {
    title: 'Najah Hub',
    slug: 'najah-hub',
    description: 'Comprehensive full-stack platform with secure authentication, role-based access, and complex database architecture.',
    content: 'Najah Hub is a feature-rich platform with authentication, role-based access control, and complex data flows. Designed for reliability, maintainability, and scalability. Real-time updates and collaborative features.',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
    images: [],
    gallery: [
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1522427335684-38143abc9f3b?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1516534775068-bb6c4e8b5f89?auto=format&fit=crop&w=1400&q=80'
    ],
    url: '',
    category: 'Education',
    tags: ['MongoDB','Express','React','Node.js','Tailwind', 'MERN']
  },
  {
    title: 'My Portfolio',
    slug: 'my-portfolio',
    description: 'Responsive portfolio website with scalable PostgreSQL database, Prisma ORM, and secure admin dashboard.',
    content: 'A personal portfolio showcasing projects and services. Built with Vite, React, Prisma, and PostgreSQL. Includes secure admin dashboard for content management, category-based project filtering, and responsive design for all devices.',
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80',
    images: [],
    gallery: [
      'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1633356122544-f134324ef6db?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1400&q=80'
    ],
    url: '',
    category: 'Corporate',
    tags: ['PostgreSQL','Prisma','React','Vite', 'Tailwind']
  },
  {
    title: 'MediCare Plus',
    slug: 'medicare-plus',
    description: 'Advanced healthcare system with patient records, appointment scheduling, telemedicine, and HIPAA compliance.',
    content: 'MediCare Plus revolutionizes healthcare delivery with comprehensive platform for doctors, patients, and administrators. Features real-time appointment scheduling, encrypted patient records, integrated video consultation, prescription management, and insurance processing.',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80',
    images: [],
    gallery: [
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1631217314830-eac5fef67474?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1576091160623-112411f7a5ca?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1579154204601-01d430c69e61?auto=format&fit=crop&w=1400&q=80'
    ],
    url: '',
    category: 'Medical',
    tags: ['React','Node.js','PostgreSQL','Redis','WebRTC', 'Healthcare']
  },
  {
    title: 'LuxeCart E-Commerce',
    slug: 'luxecart-ecommerce',
    description: 'Premium e-commerce platform with AI recommendations, 3D visualization, and seamless payment integration.',
    content: 'LuxeCart is state-of-the-art e-commerce solution for luxury brands. Features advanced inventory management, AI-powered recommendations, real-time analytics, multi-currency support, Stripe/PayPal integration, and 3D product visualization.',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1200&q=80',
    images: [],
    gallery: [
      'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1633356122544-f134324ef6db?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1626806819074-3b9b3908b38e?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1590080876969-c16b90476aa2?auto=format&fit=crop&w=1400&q=80'
    ],
    url: '',
    category: 'E-Commerce',
    tags: ['Next.js','Stripe','Prisma','Redis','Three.js', 'AI']
  },
  {
    title: 'ChefHub Restaurant Management',
    slug: 'chefhub-restaurant',
    description: 'Complete restaurant system with online ordering, kitchen display, delivery tracking, and analytics.',
    content: 'ChefHub transforms restaurant operations with real-time order management, kitchen coordination, and customer engagement tools. Includes mobile app for customers, web dashboard for managers, SMS notifications, and detailed analytics for business insights.',
    image: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=1200&q=80',
    images: [],
    gallery: [
      'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1414235077418-8ea027f20f8f?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1577992369797-8a44f7d46a17?auto=format&fit=crop&w=1400&q=80'
    ],
    url: '',
    category: 'Restaurant',
    tags: ['React Native','Node.js','MongoDB','Socket.io','Stripe', 'Mobile']
  },
  {
    title: 'EduSmart Learning Platform',
    slug: 'edusmart-platform',
    description: 'Interactive e-learning platform with live classes, course management, progress tracking, and personalized learning.',
    content: 'EduSmart empowers educators and students with all-in-one learning platform. Features live video classes using WebRTC, interactive assignments, progress analytics, gamification elements, adaptive learning algorithms, and community forums.',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
    images: [],
    gallery: [
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1522427335684-38143abc9f3b?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1516534775068-bb6c4e8b5f89?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=80'
    ],
    url: '',
    category: 'Education',
    tags: ['React','Node.js','PostgreSQL','WebRTC','TensorFlow', 'Analytics']
  },
  {
    title: 'PropConnect Real Estate',
    slug: 'propconnect-realestate',
    description: 'Modern real estate platform with virtual tours, analytics, calculators, and AI-powered recommendations.',
    content: 'PropConnect revolutionizes property buying/selling with immersive 3D virtual tours, comprehensive property analytics, intelligent AI recommendations, market insights, mortgage calculators, and CRM tools for real estate agents.',
    image: 'https://images.unsplash.com/photo-1564013799920-ab7a9c7c3ef1?auto=format&fit=crop&w=1200&q=80',
    images: [],
    gallery: [
      'https://images.unsplash.com/photo-1564013799920-ab7a9c7c3ef1?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1558036117-15cd4cecdf4c?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1460072656994-13edd7eee21a?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1400&q=80'
    ],
    url: '',
    category: 'Real Estate',
    tags: ['Next.js','Mapbox','Three.js','PostgreSQL','Machine Learning', 'Maps']
  },
  // --- إضافة 4 مشاريع لكل قطاع ---
  {
    title: 'TelemedicineHub Pro',
    slug: 'telemedicines-hub',
    description: 'Advanced telemedicine platform connecting patients with specialists for remote consultations.',
    content: 'TelemedicineHub Pro brings healthcare closer to patients with secure video consultations, encrypted medical records, prescription management, and appointment scheduling. HIPAA-compliant infrastructure ensures data privacy and regulatory compliance.',
    image: 'https://images.unsplash.com/photo-1631217314830-eac5fef67474?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1631217314830-eac5fef67474?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1576091160623-112411f7a5ca?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1579154204601-01d430c69e61?auto=format&fit=crop&w=1400&q=80'
    ],
    url: '',
    category: 'Medical',
    tags: ['React','WebRTC','Node.js','PostgreSQL','HIPAA','Health']
  },
  {
    title: 'VitalMetrics Hospital Dashboard',
    slug: 'vitalmetrics-hospital',
    description: 'Real-time hospital management system with patient monitoring and resource allocation.',
    content: 'VitalMetrics provides comprehensive hospital operations management with real-time patient vitals monitoring, bed allocation optimization, staff scheduling, inventory management, and emergency alerts. Integrates with medical devices for continuous data streaming.',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1631217314830-eac5fef67474?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1576091160623-112411f7a5ca?auto=format&fit=crop&w=1400&q=80'
    ],
    url: '',
    category: 'Medical',
    tags: ['React','Node.js','MongoDB','Socket.io','IoT','Healthcare']
  },
  {
    title: 'PharmaCare E-Pharmacy',
    slug: 'pharmacare-epharm',
    description: 'Digital pharmacy platform with prescription delivery and medication management.',
    content: 'PharmaCare revolutionizes pharmaceutical retail with mobile prescription uploads, digital pharmacy inventory, real-time delivery tracking, and medication reminders. Licensed pharmacist verification ensures patient safety and regulatory compliance.',
    image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde0f?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1587854692152-cbe660dbde0f?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1631217314830-eac5fef67474?auto=format&fit=crop&w=1400&q=80'
    ],
    url: '',
    category: 'Medical',
    tags: ['React Native','Node.js','PostgreSQL','Stripe','Delivery API']
  },
  {
    title: 'MediAnalytics Research Hub',
    slug: 'medianalytics-research',
    description: 'Data analytics platform for medical research and clinical trials.',
    content: 'MediAnalytics empowers medical researchers with advanced data analysis tools, clinical trial management, patient cohort analysis, and statistical modeling. Secure collaboration environment for research teams with real-time data visualization.',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1631217314830-eac5fef67474?auto=format&fit=crop&w=1400&q=80'
    ],
    url: '',
    category: 'Medical',
    tags: ['Python','TensorFlow','PostgreSQL','D3.js','Data Science']
  },
  {
    title: 'FashionHub Boutique Store',
    slug: 'fashionhub-boutique',
    description: 'Premium fashion e-commerce with AR try-on and personalized styling.',
    content: 'FashionHub redefines online fashion retail with augmented reality try-on features, personal stylist recommendations, sustainable fashion tracking, and social shopping. Seamless checkout with support for multiple payment methods.',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1620336655424-c5d54e64f7a6?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1563062348-c0fbe87c6fa7?auto=format&fit=crop&w=1400&q=80'
    ],
    url: '',
    category: 'E-Commerce',
    tags: ['Next.js','Three.js','React AR','Shopify API','Styling AI']
  },
  {
    title: 'ElectroMart Global Marketplace',
    slug: 'electromart-marketplace',
    description: 'Multi-vendor electronics marketplace with warranty tracking and support.',
    content: 'ElectroMart is comprehensive electronics marketplace connecting buyers with verified sellers. Features warranty management, authentic product verification, technical support chat, and buyer protection guarantees. Advanced product comparison tools.',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1633356122544-f134324ef6db?auto=format&fit=crop&w=1400&q=80'
    ],
    url: '',
    category: 'E-Commerce',
    tags: ['MERN','Elasticsearch','Stripe','Vendor Dashboard','Reviews']
  },
  {
    title: 'GroceryFresh Online Supermarket',
    slug: 'groceryfresh-supermarket',
    description: 'Same-day grocery delivery platform with inventory management.',
    content: 'GroceryFresh brings fresh groceries to homes within 2 hours. Real-time inventory tracking, personalized recommendations based on purchase history, subscription savings, and integration with local farmers markets. Real-time order tracking and substitution handling.',
    image: 'https://images.unsplash.com/photo-1585329133354-3d7b34f31d33?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1585329133354-3d7b34f31d33?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1578996413871-9ed8c0c0fca7?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1599599810694-cd5e917a2d30?auto=format&fit=crop&w=1400&q=80'
    ],
    url: '',
    category: 'E-Commerce',
    tags: ['React','Node.js','RabbitMQ','Delivery API','IoT Tracking']
  },
  {
    title: 'DineBook Restaurant Network',
    slug: 'dinebook-restaurant',
    description: 'Integrated restaurant reservation and management platform.',
    content: 'DineBook connects restaurants with diners for seamless reservations and dining experiences. Features table management, queue tracking, special occasion alerts, and post-dining feedback. Integrated POS system and inventory tracking.',
    image: 'https://images.unsplash.com/photo-1585314662646-5bead08c8abe?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1585314662646-5bead08c8abe?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1555638938-3c5906e1f3cc?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1606787276290-7a0ad9b6b5be?auto=format&fit=crop&w=1400&q=80'
    ],
    url: '',
    category: 'Restaurant',
    tags: ['React','Node.js','PostgreSQL','Twilio','Analytics']
  },
  {
    title: 'CloudChef Delivery Network',
    slug: 'cloudchef-delivery',
    description: 'Cloud kitchen network with multi-brand ordering and logistics.',
    content: 'CloudChef operates a network of optimized cloud kitchens across the city. Single app showcases multiple brands, real-time order tracking via GPS, dynamic pricing, and AI-powered delivery route optimization for minimal delivery time.',
    image: 'https://images.unsplash.com/photo-1556740716-b21eeabb5f2b?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1556740716-b21eeabb5f2b?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1525521298388-f88d287e3a50?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1579954614148-ce2cc17a63e0?auto=format&fit=crop&w=1400&q=80'
    ],
    url: '',
    category: 'Restaurant',
    tags: ['React Native','Node.js','Firebase','Mapbox','Logistics']
  },
  {
    title: 'FinServe Corporate Banking',
    slug: 'finserve-banking',
    description: 'Enterprise banking solution for corporate clients and SMEs.',
    content: 'FinServe provides comprehensive banking services for businesses including business accounts, payment processing, cash management, and enterprise loans. Dashboard analytics for financial planning, multi-user access with role-based controls.',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1516321318423-f06f70a504f0?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=80'
    ],
    url: '',
    category: 'Corporate',
    tags: ['React','Spring Boot','Oracle DB','Encryption','ComplianceAPI']
  },
  {
    title: 'TaskFlow Project Management',
    slug: 'taskflow-projects',
    description: 'Comprehensive project management suite with team collaboration tools.',
    content: 'TaskFlow revolutionizes project management with intuitive board views (Kanban, Gantt, Timeline), real-time collaboration, time tracking, resource allocation, and budget management. Integration with Slack and email for notifications.',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1516534775068-bb6c4e8b5f89?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1611432473558-edc32295a235?auto=format&fit=crop&w=1400&q=80'
    ],
    url: '',
    category: 'Corporate',
    tags: ['Vue.js','Node.js','GraphQL','PostgreSQL','Collaboration']
  },
  {
    title: 'InnovateHub Startup Platform',
    slug: 'innovatehub-startup',
    description: 'Platform connecting startups with investors and mentors.',
    content: 'InnovateHub is ecosystem for startups to pitch ideas, connect with investors, access mentoring, and apply for grants. Pitch deck templates, investor database, due diligence tools, and community forums for knowledge sharing.',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=80'
    ],
    url: '',
    category: 'Corporate',
    tags: ['Next.js','Supabase','Analytics','Video Upload','Notifications']
  },
  {
    title: 'VirtualClass Online School',
    slug: 'virtualclass-school',
    description: 'Interactive online schooling platform with live classes and assessments.',
    content: 'VirtualClass brings full K-12 education online with live interactive classes, recorded sessions for offline learning, automated assessments, and parent-teacher communications. Supports large group lessons and individual tutoring sessions.',
    image: 'https://images.unsplash.com/photo-1514108657386-94fb68e2fc68?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1514108657386-94fb68e2fc68?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1516534775068-bb6c4e8b5f89?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1400&q=80'
    ],
    url: '',
    category: 'Education',
    tags: ['React','Agora.io','Node.js','PostgreSQL','Virtual Classroom']
  },
  {
    title: 'SkillUp Online Courses',
    slug: 'skillup-courses',
    description: 'Comprehensive online course platform for professional development.',
    content: 'SkillUp offers thousands of professional courses in tech, business, and creative fields. Interactive quizzes, certificates upon completion, instructor Q&A, progress tracking, and downloadable resources. Subscription and pay-per-course models.',
    image: 'https://images.unsplash.com/photo-1522427335684-38143abc9f3b?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1522427335684-38143abc9f3b?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1516534775068-bb6c4e8b5f89?auto=format&fit=crop&w=1400&q=80'
    ],
    url: '',
    category: 'Education',
    tags: ['React','Stripe','Vimeo API','MongoDB','Certificates']
  },
  {
    title: 'RealityVR Education',
    slug: 'realityvr-education',
    description: 'Immersive VR learning experiences for STEM education.',
    content: 'RealityVR creates immersive virtual reality environments for hands-on STEM learning. Students explore molecular structures, historical events, engineering concepts in 3D. Teacher dashboards track engagement and learning outcomes.',
    image: 'https://images.unsplash.com/photo-1578996413871-9ed8c0c0fca7?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1578996413871-9ed8c0c0fca7?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1489749798305-4fea3ba63d60?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=1400&q=80'
    ],
    url: '',
    category: 'Education',
    tags: ['VR','Unity','WebGL','Three.js','Learning Science']
  },
  {
    title: 'LuxeResidences Property Management',
    slug: 'luxeresidences-property',
    description: 'Luxury residential property management with white-glove service tracking.',
    content: 'LuxeResidences caters to luxury residential market with premium virtual tours, detailed property analytics, neighborhood insights, comparable sales analysis, and white-glove concierge services. Investment ROI calculators and market trend analysis.',
    image: 'https://images.unsplash.com/photo-1570129477492-45201003074e?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1570129477492-45201003074e?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1558036117-15cd4cecdf4c?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1400&q=80'
    ],
    url: '',
    category: 'Real Estate',
    tags: ['Next.js','Mapbox','Three.js','PostgreSQL','CRM']
  },
  {
    title: 'CommercialPlex Spaces',
    slug: 'commercialplex-spaces',
    description: 'Commercial real estate platform for office and retail spaces.',
    content: 'CommercialPlex connects businesses with ideal commercial spaces. 360 virtual tours, detailed floor plans, demographics analysis, lease calculators, and broker networks. Integration with CoStar and commercial data providers.',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1558036117-15cd4cecdf4c?auto=format&fit=crop&w=1400&q=80'
    ],
    url: '',
    category: 'Real Estate',
    tags: ['React','Node.js','PostgreSQL','Geolocation','Analytics']
  },
  {
    title: 'HolidayStay Vacation Rentals',
    slug: 'holidaystay-rentals',
    description: 'Vacation rental marketplace connecting homeowners with travelers.',
    content: 'HolidayStay is comprehensive vacation rental platform with secure booking, damage protection, guest screening, and property management tools. Dynamic pricing, calendar sync, and automated message templates for hosts.',
    image: 'https://images.unsplash.com/photo-1618684714596-c47fb5b4c656?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1618684714596-c47fb5b4c656?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1543545521-d2c3201371e7?auto=format&fit=crop&w=1400&q=80'
    ],
    url: '',
    category: 'Real Estate',
    tags: ['React','Stripe','Mapbox','Email API','Calendar Sync']
  }
]

async function seedToDb() {
  for (const p of projects) {
    // In production do not overwrite existing projects; only create if missing
    if (process.env.NODE_ENV === 'production') {
      const existing = await prisma.project.findUnique({ where: { slug: p.slug } })
      if (existing) { console.log('Skipping existing project in production:', p.slug); continue }
      await prisma.project.create({ data: p })
      console.log('Created project:', p.slug)
    } else {
      // dev: upsert is fine
      await prisma.project.upsert({
        where: { slug: p.slug },
        update: { title: p.title, description: p.description, content: p.content, image: p.image, images: p.images || [], gallery: p.gallery || [], url: p.url, category: p.category || 'General', tags: p.tags },
        create: p,
      })
      console.log('Upserted project:', p.slug)
    }
  }
}

function writeFallback() {
  const out = path.join(__dirname, 'seed-data.json')
  fs.writeFileSync(out, JSON.stringify(projects, null, 2))
  console.log('Wrote fallback seed data to', out)
}

// Ensure projects include gallery when writing fallback
projects.forEach(p => { p.gallery = p.gallery || (p.images ? p.images.slice(0,3) : (p.image ? [p.image] : [])) })

async function main() {
  const canSeedAdmin = process.env.ADMIN_SETUP_TOKEN && process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD && process.env.ADMIN_NAME

  if (!process.env.DATABASE_URL) {
    if (process.env.NODE_ENV === 'production') {
      console.error('FATAL: DATABASE_URL is required in production for seeding. Exiting.')
      process.exit(1)
    }
    console.warn('DATABASE_URL not set — writing fallback seed file instead of DB seeding.')
    writeFallback()
    if (canSeedAdmin) {
      // write admin fallback with hashed password
      const bcrypt = require('bcrypt')
      const admin = {
        email: process.env.ADMIN_EMAIL,
        name: process.env.ADMIN_NAME,
      }
      const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10)
      const out = path.join(__dirname, 'admin-seed.json')
      require('fs').writeFileSync(out, JSON.stringify({ admin: { ...admin, password: hashed } }, null, 2))
      console.log('Wrote fallback admin to', out)
    } else {
      console.log('ADMIN_* env vars missing; admin seed skipped')
    }
    return
  }

  // Seed projects to DB
  await seedToDb()

  // Seed admin to DB if env vars present
  if (canSeedAdmin) {
    const bcrypt = require('bcrypt')
    const existing = await prisma.adminUser.findUnique({ where: { email: process.env.ADMIN_EMAIL } })
    const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10)
    if (existing) {
      // In production, do not overwrite existing admin; just report
      if (process.env.NODE_ENV === 'production') {
        console.log('Admin exists; skipping update in production:', process.env.ADMIN_EMAIL)
      } else {
        await prisma.adminUser.update({ where: { email: process.env.ADMIN_EMAIL }, data: { name: process.env.ADMIN_NAME, password: hashed } })
        console.log('Updated admin user:', process.env.ADMIN_EMAIL)
      }
    } else {
      await prisma.adminUser.create({ data: { email: process.env.ADMIN_EMAIL, name: process.env.ADMIN_NAME, password: hashed } })
      console.log('Created admin user:', process.env.ADMIN_EMAIL)
    }
  } else {
    console.log('ADMIN_* env vars missing; admin seed skipped')
  }
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
