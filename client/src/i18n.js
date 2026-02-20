import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  en: {
    translation: {
      // Navigation
      nav: { 
        home: 'Home', 
        projects: 'Projects', 
        services: 'Services', 
        about: 'About', 
        contact: 'Contact' 
      },
      // Hero Section
      hero: { 
        title: 'CTRL',
        zero: 'ZERO',
        badge: 'Available for new projects',
        viewWork: 'View Our Work',
        contact: 'Book a Call',
        subtitle: 'We don\'t just write code; we architect digital experiences. Premium product engineering for startups and visionary enterprises.', 
        phrases: [
          "Building Scalable Systems",
          "Crafting Beautiful UI",
          "Engineering the Future"
        ],
        projectAlt: 'Project screenshot'
      },
      // Home Page
      home: { 
        techTitle: 'Powered by Modern Tech', 
        offerTitle: 'Our Expertise',
        offerSubtitle: 'Comprehensive solutions for the modern web.',
        weCan: 'We Can',
        readyTitle: 'Ready to',
        scaleUp: 'Scale Up?',
        ctaDesc: "Stop waiting. Let's build the software your business deserves.",
        stats: {
          yearsExp: 'Years Exp.',
          projects: 'Projects',
          coffee: 'Cups of Coffee',
          ideas: 'Ideas Realized'
        }
      },
      services: {
        pageTitle: 'Services',
        subTitle: 'We deliver engineering excellence across the entire tech stack.',
        ourServices: 'Our Premium Services',
        ourServicesDesc: 'We deliver engineering excellence across the entire tech stack. From stunning interfaces to powerful backends, we cover it all.',
        fullstack: { 
          title: 'Full-Stack Engineering', 
          desc: 'From database architecture to responsive frontends. We build robust, scalable applications using the MERN stack and Next.js.' 
        },
        uiux: { 
          title: 'UI/UX Design', 
          desc: 'Pixel-perfect interfaces that users love. We focus on accessibility, aesthetics, and interaction design.' 
        },
        product: { 
          title: 'Product Strategy', 
          desc: 'Turning raw ideas into MVP and market-ready products.' 
        },
        cta: 'Start Your Project',
        learnMore: 'Learn More',
        backBtn: 'Back to Services',
        detailsTitle: 'Service Details',
        overview: 'Overview',
        readyTitle: 'Ready to start?',
        readyDesc: 'Let’s turn this service into a reality for your business.',
        getQuote: 'Get a Quote',
        whatsapp: 'Chat on WhatsApp',
        whyUs: 'Why Choose Us?',        devops: {
          title: 'DevOps & Cloud',
          desc: 'CI/CD pipelines, Docker containerization, and cloud deployment.'
        },        features: {
          eng: 'Professional Engineering',
          support: '24/7 Support',
          scale: 'Scalable Solutions'
        },
        noDesc: 'No detailed description available yet.'
      },
      about: {
        pageTitle: 'About Me',
        introTitle: 'Who I Am',
        introBody: 'I am Eng. Yazan Saadeh, a Computer Engineer bridging the gap between complex backend logic and stunning frontend aesthetics. I have a passion for problem-solving and building resilient systems.',
        techTitle: 'Engineering & Tech',
        techBody: 'Specializing in modern web platforms. Leveraging the power of Next.js for SSR, Prisma & PostgreSQL for complex data relations, and Docker for reproducible environments.',
        designTitle: 'Design Philosophy',
        designBody: 'My philosophy is simple: Design is not just how it looks, it is how it works. I create User-Centric experiences that feel natural, focusing on accessibility and visual hierarchy.',
        testimonials: {
          title: 'What Clients Say',
          subtitle: 'Selected testimonials from clients and partners.',
          items: [
            { quote: 'CTRL ZERO helped us launch a performant platform that scaled to millions of users.', role: 'CEO, TechCorp' },
            { quote: 'Professional, timely, and deeply thoughtful engineering work.', role: 'Product Lead, RetailX' },
            { quote: 'Exceeded expectations in design and delivery.', role: 'Founder, Startly' }
          ]
        }
      },
      contact: { 
        title: 'Get in Touch', 
        subtitle: "Have a project in mind? We would love to hear from you. Let's build something amazing together.",
        formTitle: 'Send us a message',
        btn: "Let's Talk",
        name: 'Full Name', 
        email: 'Email Address', 
        subject: 'Subject', 
        message: 'Your Message',
        namePlaceholder: 'Enter your full name',
        emailPlaceholder: 'your@email.com',
        subjectPlaceholder: 'Project or inquiry subject',
        messagePlaceholder: 'Tell us about your project...',
        send: 'Send Message', 
        phone: 'Phone',
        location: 'Location',
        social: 'Follow Us',
        sent: 'Message sent successfully! We will contact you soon.', 
        failed: 'Failed to send message. Please try again later.' 
      },
      projects: {
        portfolio: 'PORTFOLIO',
        title: 'Selected Works',
        subtitle: 'A showcase of our technical expertise. Discover how we turn complex problems into elegant digital solutions.',
        more: 'Want to see code?',
        github: 'Visit our GitHub',
        details: 'Details',
        sectors: {
          all: 'All Projects',
          medical: 'Medical',
          ecommerce: 'E-Commerce',
          restaurant: 'Restaurant',
          corporate: 'Corporate',
          education: 'Education',
          realestate: 'Real Estate'
        },
        filters: {
          all: 'All',
          webapp: 'Web App',
          mobileapp: 'Mobile App',
          'e-commerce': 'E-Commerce',
          iot: 'IoT',
          ai: 'AI'
        }
      },
      // --- إضافة جديدة: ترجمة صفحة تفاصيل المشروع ---
      projectDetails: {
        back: 'Back to Projects',
        challenge: 'The Challenge & Solution',
        gallery: 'Project Gallery',
        shots: 'SHOTS',
        info: 'Project Info',
        client: 'Client / Type',
        tech: 'Technologies',
        visit: 'Visit Live Site',
        code: 'View Code',
        startProject: 'Start a Project',
        similar: 'Build something similar?',
        discuss: "Let's discuss how we can engineer a solution for you."
      },
      footer: { 
        links: 'Quick Links', 
        rights: 'All rights reserved.' 
      },
      login: { title: 'Admin Login', email: 'Email', password: 'Password', login: 'Login', scanning: 'Scanning...' },
      loading: 'Loading...'
    }
  },
  ar: {
    translation: {
      nav: { 
        home: 'الرئيسية', 
        projects: 'المشاريع', 
        services: 'الخدمات', 
        about: 'من نحن', 
        contact: 'اتصل' 
      },
      hero: {
        title: 'CTRL ZERO',
        badge: 'متاحون لمشاريع جديدة',
        viewWork: 'شاهد أعمالنا',
        contact: 'احجز استشارة',
        subtitle: 'نحن لا نكتب الكود فحسب، بل نبني تجارب رقمية متكاملة. هندسة برمجيات فاخرة للشركات الناشئة والمؤسسات الطموحة.',
        phrases: [
          "بناء أنظمة قابلة للتوسع",
          "تصميم واجهات جذابة",
          "هندسة المستقبل الرقمي"
        ],
        projectAlt: 'صورة المشروع'
      },
      home: { 
        techTitle: 'مدعوم بأحدث التقنيات', 
        offerTitle: 'مجالات خبرتنا',
        offerSubtitle: 'حلول شاملة للويب الحديث.',
        weCan: 'نستطيع',
        readyTitle: 'هل أنت مستعد',
        scaleUp: 'للتطور؟',
        ctaDesc: 'توقف عن الانتظار. دعنا نبني لك البرمجيات التي يستحقها عملك.'
      },
      services: {
        pageTitle: 'خدماتنا',
        subTitle: 'نقدم التميز الهندسي عبر كافة التقنيات الحديثة.',
        ourServices: 'خدماتنا المميزة',
        ourServicesDesc: 'نقدم التميز الهندسي عبر كافة التقنيات الحديثة. من الواجهات الجميلة إلى الأنظمة الخلفية القوية، نغطي كل شيء.',
        fullstack: { 
          title: 'تطوير شامل (Full-Stack)', 
          desc: 'من هيكلة قواعد البيانات إلى واجهات المستخدم التفاعلية. نبني تطبيقات قوية وقابلة للتوسع باستخدام MERN و Next.js.' 
        },
        uiux: { 
          title: 'تصميم تجربة المستخدم (UI/UX)', 
          desc: 'واجهات مثالية يعشقها المستخدمون. نركز على سهولة الاستخدام، الجماليات، وتفاعل المستخدم.' 
        },
        product: { 
          title: 'استراتيجية المنتجات', 
          desc: 'تحويل الأفكار الخام إلى منتجات أولية (MVP) جاهزة لدخول السوق بقوة.' 
        },
        cta: 'ابدأ مشروعك',
        learnMore: 'تعرف أكثر',
        backBtn: 'عودة للخدمات',
        detailsTitle: 'تفاصيل الخدمة',
        overview: 'نظرة عامة',
        readyTitle: 'جاهز للبدء؟',
        readyDesc: 'دعنا نحول هذه الخدمة إلى واقع ملموس لعملك.',
        getQuote: 'اطلب عرض سعر',
        whatsapp: 'دردش عبر واتساب',
        whyUs: 'لماذا تختارنا؟',
        devops: {
          title: 'DevOps و البنية السحابية',
          desc: 'خطوط أنابيب CI/CD وحاويات Docker والنشر السحابي.'
        },
        features: {
          eng: 'هندسة احترافية',
          support: 'دعم فني 24/7',
          scale: 'حلول قابلة للتوسع'
        },
        noDesc: 'لا يوجد وصف تفصيلي متاح حالياً.'
      },
      about: {
        pageTitle: 'من أنا',
        introTitle: 'القصة باختصار',
        introBody: 'أنا يزن سعادة، مهندس حاسوب يمتلك رؤية تجمع بين دقة الأنظمة الخلفية (Backend) وجماليات الواجهات الأمامية (Frontend). شغفي لا يتوقف عند كتابة الكود، بل يمتد لبناء حلول تقنية متكاملة قابلة للتوسع.',
        techTitle: 'هندسة الأنظمة',
        techBody: 'أتخصص في بناء المنصات الرقمية الحديثة باستخدام أحدث التقنيات. أعتمد على Next.js للسرعة، و PostgreSQL للبيانات المعقدة، وأبني بنية تحتية صلبة تتحمل ضغط العمل الحقيقي.',
        designTitle: 'فلسفة التصميم',
        designBody: 'التصميم ليس مجرد ألوان، بل هو "كيف يعمل المنتج". أركز على تجربة المستخدم (UX) لضمان أن تكون واجهاتي ليست فقط جميلة، بل سهلة الاستخدام وتخدم الهدف بذكاء.',
        testimonials: {
          title: 'آراء العملاء',
          subtitle: 'أقوال مختارة من عملائنا وشركائنا.',
          items: [
            { quote: 'ساعدنا CTRL ZERO في إطلاق منصة عالية الأداء وصلت إلى ملايين المستخدمين.', role: 'الرئيس التنفيذي، TechCorp' },
            { quote: 'عمل احترافي، في الوقت المحدد، ومتفوق من ناحية الجودة.', role: 'مديرة المنتج، RetailX' },
            { quote: 'تجاوز التوقعات في التصميم والتسليم.', role: 'مؤسس، Startly' }
          ]
        }
      },
      contact: { 
        title: 'تواصل معنا', 
        subtitle: 'هل لديك فكرة مشروع في ذهنك؟ نود أن نسمع منك. دعنا نبني معاً شيئاً مذهلاً.',
        formTitle: 'أرسل لنا رسالة',
        btn: "هيا نتحدث",
        name: 'الاسم الكامل', 
        email: 'البريد الإلكتروني', 
        subject: 'الموضوع', 
        message: 'رسالتك',
        namePlaceholder: 'أدخل اسمك الكامل',
        emailPlaceholder: 'your@email.com',
        subjectPlaceholder: 'موضوع المشروع',
        messagePlaceholder: 'حدثنا عن مشروعك...',
        send: 'إرسال الرسالة', 
        phone: 'الهاتف',
        location: 'الموقع',
        social: 'تابعنا على',
        sent: 'تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.',
        failed: 'فشل الإرسال. يرجى المحاولة مرة أخرى لاحقاً.' 
      },
      projects: {
        portfolio: 'معرض الأعمال',
        title: 'مشاريع مختارة',
        subtitle: 'استكشف نخبة من مشاريعنا البرمجية. اكتشف كيف نحول المشاكل المعقدة إلى حلول رقمية أنيقة.',
        more: 'تريد رؤية الكود؟',
        github: 'زر حسابنا على GitHub',
        details: 'تفاصيل',
        sectors: {
          all: 'جميع المشاريع',
          medical: 'الطب والصحة',
          ecommerce: 'التجارة الإلكترونية',
          restaurant: 'المطاعم والضيافة',
          corporate: 'الشركات والمؤسسات',
          education: 'التعليم والتدريب',
          realestate: 'العقارات والسياحة'
        },
        filters: {
          all: 'الكل',
          webapp: 'تطبيقات الويب',
          mobileapp: 'تطبيقات الموبايل',
          'e-commerce': 'متاجر إلكترونية',
          iot: 'إنترنت الأشياء',
          ai: 'ذكاء اصطناعي'
        }
      },
      // --- ترجمة تفاصيل المشروع (عربي) ---
      projectDetails: {
        back: 'عودة للمشاريع',
        challenge: 'التحدي والحل',
        gallery: 'معرض الصور',
        shots: 'لقطات',
        info: 'معلومات المشروع',
        client: 'العميل / النوع',
        tech: 'التقنيات المستخدمة',
        visit: 'زيارة الموقع',
        code: 'عرض الكود',
        startProject: 'ابدأ مشروعك',
        similar: 'تريد بناء شيء مشابه؟',
        discuss: 'دعنا نناقش كيف يمكننا هندسة حل تقني مخصص لك.'
      },
      footer: { 
        links: 'روابط سريعة', 
        rights: 'جميع الحقوق محفوظة.' 
      },
      login: { title: 'تسجيل دخول المشرف', email: 'البريد الإلكتروني', password: 'كلمة المرور', login: 'تسجيل الدخول', scanning: 'جاري الفحص...' },
      loading: 'جارٍ التحميل...'
    }
  }
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    showSupportNotice: false,
    interpolation: { escapeValue: false }
  })

i18n.on('languageChanged', (lng) => {
  const dir = lng === 'ar' ? 'rtl' : 'ltr'
  document.documentElement.dir = dir
  document.documentElement.lang = lng
  if (document.body) document.body.dir = dir
})

export default i18n