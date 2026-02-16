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
        contact: 'Contact',
        english: 'ENGLISH',
        arabic: '‏العربية'
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
        },
        softwareAgency: 'Software Agency'
      },
      // Services
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
        readyDesc: 'Let\'s turn this service into a reality for your business.',
        getQuote: 'Get a Quote',
        whatsapp: 'Chat on WhatsApp',
        whyUs: 'Why Choose Us?',
        devops: {
          title: 'DevOps & Cloud',
          desc: 'CI/CD pipelines, Docker containerization, and cloud deployment.'
        },
        features: {
          eng: 'Professional Engineering',
          support: '24/7 Support',
          scale: 'Scalable Solutions'
        },
        noDesc: 'No detailed description available yet.',
        quote: "We don't just deliver code; we engineer solutions that drive measurable business growth."
      },
      // About Page
      about: {
        pageTitle: 'About Me',
        mainTitle: 'ENGINEERING',
        mainTitleSpan: 'DIGITAL REALITY',
        introTitle: 'Who I Am',
        introBody: 'Combining engineering precision with artistic vision to craft web experiences that leave a mark.',
        detailsIntroBody: 'I am Eng. Yazan Saadeh, a Computer Engineer bridging the gap between complex backend logic and stunning frontend aesthetics. I have a passion for problem-solving and building resilient systems.',
        techTitle: 'Engineering & Tech',
        techSubtitle: 'Code is my Craft',
        techBody: 'Specializing in modern web platforms. Leveraging the power of Next.js for SSR, Prisma & PostgreSQL for complex data relations, and Docker for reproducible environments.',
        designTitle: 'Design Philosophy',
        designBody: 'My philosophy is simple: Design is not just how it looks, it is how it works. I create User-Centric experiences that feel natural, focusing on accessibility and visual hierarchy.',
        coreValues: {
          innovation: {
            title: 'Innovation First',
            desc: 'Always looking for creative solutions to complex problems.'
          },
          precision: {
            title: 'Precision & Speed',
            desc: 'Delivering high-quality code without missing deadlines.'
          },
          partnership: {
            title: 'Client Partnership',
            desc: 'I don\'t just work for you; I work with you to succeed.'
          }
        },
        testimonials: {
          title: 'What Clients Say',
          subtitle: 'Selected testimonials from clients and partners.',
          items: [
            { quote: 'CTRL ZERO helped us launch a performant platform that scaled to millions of users.', author: 'Ahmed Al-Hadid', role: 'CEO, TechCorp' },
            { quote: 'Professional, timely, and deeply thoughtful engineering work.', author: 'Sara Khalil', role: 'Product Lead, RetailX' },
            { quote: 'Exceeded expectations in design and delivery.', author: 'Omar N.', role: 'Founder, Startly' }
          ]
        },
        talkBtn: 'Let\'s Talk',
        designedBy: 'Designed & Built by'
      },
      // Contact Page
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
        failed: 'Failed to send message. Please try again later.',
        validation: {
          nameRequired: 'Full name is required.',
          emailRequired: 'Email address is required.',
          emailInvalid: 'Please enter a valid email address.',
          subjectRequired: 'Subject is required.',
          messageRequired: 'Message is required (min 5 characters).',
          messageTooShort: 'Message must be at least 5 characters long.'
        }
      },
      // Projects
      projects: {
        portfolio: 'PORTFOLIO',
        title: 'Selected Works',
        subtitle: 'A showcase of our technical expertise. Discover how we turn complex problems into elegant digital solutions.',
        ourPrefix: 'Our ',
        expertiseBadge: '✨ OUR EXPERTISE',
        mainTitle: 'Digital Solutions',
        mainSubtitle: 'by Industry',
        headerDesc: 'We deliver specialized digital solutions tailored to each industry. Explore our successful projects and real-world case studies.',
        viewAll: 'View All Projects',
        more: 'Want to see code?',
        github: 'Visit our GitHub',
        details: 'Details'
      },
      // Project Sectors & Filters
      sectors: {
        all: 'All Projects',
        medical: 'Medical',
        ecommerce: 'E-Commerce',
        restaurant: 'Restaurant',
        corporate: 'Corporate',
        education: 'Education',
        realestate: 'Real Estate'
        ,
        headerBadge: 'EXPLORE SECTORS',
        headerTitle: 'Filter by Industry',
        headerDesc: 'Discover our specialized projects across various industries',
        clickToFilter: 'Click to filter',
        viewAll: 'View All',
        sectorLabel: 'SECTOR',
        allSectors: 'All Sectors',
        contactNow: 'Contact Now',
        comingSoonTitle: 'Coming Soon',
        inDevelopment: 'In Development',
        comingDesc: 'We are crafting exceptional digital solutions and innovative projects in this sector. Get ready for something extraordinary!',
        features: {
          fastLabel: 'Lightning Fast',
          fastSubtext: 'High Performance',
          designLabel: 'Beautiful Design',
          designSubtext: 'Premium UI',
          launchLabel: 'Launch Soon',
          launchSubtext: 'Coming Now'
        },
        notifyMe: 'Notify Me',
        subscribed: '✓ Subscribed!'
      },
      filters: {
        all: 'All',
        webapp: 'Web App',
        mobileapp: 'Mobile App',
        'e-commerce': 'E-Commerce',
        iot: 'IoT',
        ai: 'AI'
      },
      // Project Details
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
        discuss: "Let's discuss how we can engineer a solution for you.",
        notFound: 'Project Not Found',
        notFoundDesc: 'The project you\'re looking for doesn\'t exist.'
      },
      // Coming Soon
      comingSoon: {
        comingVerySOon: 'Coming',
        soon: 'Soon',
        title: 'Something Amazing is Brewing',
        subtitle: 'We\'re working on something spectacular. Stay tuned for an incredible experience.',
        backHome: 'Back to Home'
      },
      // Login
      login: {
        title: 'Admin Login',
        subtitle: 'Secure Admin Gateway',
        email: 'Email',
        password: 'Password',
        login: 'Login',
        scanning: 'Scanning...',
        invalidCreds: 'Invalid credentials. Access denied.'
      },
      // Footer
      footer: { 
        links: 'Quick Links', 
        rights: 'All rights reserved.',
        designedAndBuiltBy: 'Designed & Built by',
        builtWith: 'Built with'
      },
      // Common
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      noData: 'No data available'
    }
  },
  ar: {
    translation: {
      // Navigation
      nav: { 
        home: 'الرئيسية', 
        projects: 'المشاريع', 
        services: 'الخدمات', 
        about: 'من نحن', 
        contact: 'اتصل',
        english: 'ENGLISH',
        arabic: 'العربية'
      },
      // Hero Section
      hero: {
        title: 'CTRL',
        zero: 'ZERO',
        badge: 'متاحون لمشاريع جديدة',
        viewWork: 'شاهد أعمالنا',
        contact: 'احجز استشارة',
        subtitle: 'نحن لا نكتب الكود فحسب، بل نبني تجارب رقمية متكاملة. هندسة برمجيات فاخرة للشركات الناشئة والمؤسسات الطموحة.',
        phrases: [
          'بناء أنظمة قابلة للتوسع',
          'تصميم واجهات جذابة',
          'هندسة المستقبل الرقمي'
        ],
        projectAlt: 'صورة المشروع'
      },
      // Home Page
      home: { 
        techTitle: 'مدعوم بأحدث التقنيات', 
        offerTitle: 'مجالات خبرتنا',
        offerSubtitle: 'حلول شاملة للويب الحديث.',
        weCan: 'نستطيع',
        readyTitle: 'هل أنت مستعد',
        scaleUp: 'للتطور؟',
        ctaDesc: 'توقف عن الانتظار. دعنا نبني لك البرمجيات التي يستحقها عملك.',
        stats: {
          yearsExp: 'سنوات خبرة',
          projects: 'مشروع',
          coffee: 'فنجان قهوة',
          ideas: 'فكرة منجزة'
        },
        softwareAgency: 'وكالة برمجيات'
      },
      // Services
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
        noDesc: 'لا يوجد وصف تفصيلي متاح حالياً.',
        quote: 'نحن لا نقدم مجرد كود، بل نبني حلولاً هندسية تدفع عجلة نمو مشروعك.'
      },
      // About Page
      about: {
        pageTitle: 'من أنا',
        mainTitle: 'هندسة',
        mainTitleSpan: 'الواقع الرقمي',
        introTitle: 'القصة باختصار',
        introBody: 'أجمع بين دقة الهندسة والرؤية الفنية لصناعة تجارب ويب تترك أثراً.',
        detailsIntroBody: 'أنا يزن سعادة، مهندس حاسوب يمتلك رؤية تجمع بين دقة الأنظمة الخلفية (Backend) وجماليات الواجهات الأمامية (Frontend). شغفي لا يتوقف عند كتابة الكود، بل يمتد لبناء حلول تقنية متكاملة قابلة للتوسع.',
        techTitle: 'هندسة الأنظمة',
        techSubtitle: 'الكود هو حرفتي',
        techBody: 'أتخصص في بناء المنصات الرقمية الحديثة باستخدام أحدث التقنيات. أعتمد على Next.js للسرعة، و PostgreSQL للبيانات المعقدة، وأبني بنية تحتية صلبة تتحمل ضغط العمل الحقيقي.',
        designTitle: 'فلسفة التصميم',
        designBody: 'التصميم ليس مجرد ألوان، بل هو "كيف يعمل المنتج". أركز على تجربة المستخدم (UX) لضمان أن تكون واجهاتي ليست فقط جميلة، بل سهلة الاستخدام وتخدم الهدف بذكاء.',
        coreValues: {
          innovation: {
            title: 'الابتكار أولاً',
            desc: 'البحث الدائم عن حلول إبداعية للمشاكل المعقدة.'
          },
          precision: {
            title: 'الدقة والسرعة',
            desc: 'توصيل أكواد عالية الجودة دون تفويت المواعيد النهائية.'
          },
          partnership: {
            title: 'الشراكة مع العميل',
            desc: 'لا أعمل فقط من أجلك، بل أعمل معك لتحقيق النجاح.'
          }
        },
        testimonials: {
          title: 'آراء العملاء',
          subtitle: 'أقوال مختارة من عملائنا وشركائنا.',
          items: [
            { quote: 'ساعدنا CTRL ZERO في إطلاق منصة عالية الأداء وصلت إلى ملايين المستخدمين.', author: 'أحمد الحديد', role: 'الرئيس التنفيذي، TechCorp' },
            { quote: 'عمل احترافي، في الوقت المحدد، ومتفوق من ناحية الجودة.', author: 'سارة خليل', role: 'مديرة المنتج، RetailX' },
            { quote: 'تجاوز التوقعات في التصميم والتسليم.', author: 'عمر ن.', role: 'مؤسس، Startly' }
          ]
        },
        talkBtn: 'هيا نتحدث',
        designedBy: 'تم التصميم والبناء بواسطة'
      },
      // Contact Page
      contact: { 
        title: 'تواصل معنا', 
        subtitle: 'هل لديك فكرة مشروع في ذهنك؟ نود أن نسمع منك. دعنا نبني معاً شيئاً مذهلاً.',
        formTitle: 'أرسل لنا رسالة',
        btn: 'هيا نتحدث',
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
        failed: 'فشل الإرسال. يرجى المحاولة مرة أخرى لاحقاً.',
        validation: {
          nameRequired: 'الاسم الكامل مطلوب.',
          emailRequired: 'البريد الإلكتروني مطلوب.',
          emailInvalid: 'يرجى إدخال بريد إلكتروني صحيح.',
          subjectRequired: 'الموضوع مطلوب.',
          messageRequired: 'الرسالة مطلوبة (5 أحرف على الأقل).',
          messageTooShort: 'يجب أن تكون الرسالة 5 أحرف على الأقل.'
        }
      },
      // Projects
      projects: {
        portfolio: 'معرض الأعمال',
        title: 'مشاريع مختارة',
        subtitle: 'استكشف نخبة من مشاريعنا البرمجية. اكتشف كيف نحول المشاكل المعقدة إلى حلول رقمية أنيقة.',
        ourPrefix: 'مشاريع ',
        expertiseBadge: '✨ استكشف قطاعاتنا',
        mainTitle: 'مشاريعنا حسب',
        mainSubtitle: 'القطاع',
        headerDesc: 'نقدم حللاً رقمياً متخصصاً في كل قطاع. اختر المجال لاستكشاف مشاريعنا الناجحة والحالات العملية.',
        viewAll: 'عرض جميع المشاريع',
        more: 'تريد رؤية الكود؟',
        github: 'زر حسابنا على GitHub',
        details: 'تفاصيل'
      },
      // Project Sectors & Filters
      sectors: {
        all: 'جميع المشاريع',
        medical: 'الطب والصحة',
        ecommerce: 'التجارة الإلكترونية',
        restaurant: 'المطاعم والضيافة',
        corporate: 'الشركات والمؤسسات',
        education: 'التعليم والتدريب',
        realestate: 'العقارات والسياحة'
        ,
        headerBadge: 'اختر القطاع',
        headerTitle: 'تصفح مشاريعنا حسب القطاع',
        headerDesc: 'استكشف مشاريعنا المتخصصة في مختلف القطاعات والصناعات',
        clickToFilter: 'اضغط للفتر',
        viewAll: 'عرض الكل',
        sectorLabel: 'القطاع',
        allSectors: 'جميع القطاعات',
        contactNow: 'تواصل معنا',
        comingSoonTitle: 'قريباً جداً',
        inDevelopment: 'تحت الإنجاز',
        comingDesc: 'نحن نعمل بجد لإحضار أفضل الحلول الرقمية والمشاريع المبتكرة في هذا القطاع. استعد لتجربة شيء استثنائي!',
        features: {
          fastLabel: 'سريع جداً',
          fastSubtext: 'أداء عالي',
          designLabel: 'تصميم احترافي',
          designSubtext: 'واجهة متقدمة',
          launchLabel: 'قريباً جداً',
          launchSubtext: 'قريب جداً'
        },
        notifyMe: 'اخبرني عند الإطلاق',
        subscribed: '✓ تم التسجيل!'
      },
      filters: {
        all: 'الكل',
        webapp: 'تطبيقات الويب',
        mobileapp: 'تطبيقات الموبايل',
        'e-commerce': 'متاجر إلكترونية',
        iot: 'إنترنت الأشياء',
        ai: 'ذكاء اصطناعي'
      },
      // Project Details
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
        discuss: 'دعنا نناقش كيف يمكننا هندسة حل تقني مخصص لك.',
        notFound: 'المشروع غير موجود',
        notFoundDesc: 'المشروع الذي تبحث عنه غير موجود.'
      },
      // Coming Soon
      comingSoon: {
        comingVerySoon: 'قريباً',
        soon: 'جداً',
        title: 'شيء مذهل قيد الإنجاز',
        subtitle: 'نحن نعمل على شيء رائع جداً. ترقب تجربة لا تُنسى.',
        backHome: 'عودة للرئيسية'
      },
      // Login
      login: {
        title: 'تسجيل دخول المشرف',
        subtitle: 'بوابة الإدارة الآمنة',
        email: 'البريد الإلكتروني',
        password: 'كلمة المرور',
        login: 'تسجيل الدخول',
        scanning: 'جاري الفحص...',
        invalidCreds: 'بيانات الوصول غير صحيحة. الوصول مرفوض.'
      },
      // Footer
      footer: { 
        links: 'روابط سريعة', 
        rights: 'جميع الحقوق محفوظة.',
        designedAndBuiltBy: 'تم التصميم والبناء بواسطة',
        builtWith: 'تم البناء باستخدام'
      },
      // Common
      loading: 'جارٍ التحميل...',
      error: 'خطأ',
      success: 'نجح',
      back: 'عودة',
      next: 'التالي',
      previous: 'السابق',
      noData: 'لا توجد بيانات متاحة'
    }
  }
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false }
  })

i18n.on('languageChanged', (lng) => {
  const dir = lng === 'ar' ? 'rtl' : 'ltr'
  document.documentElement.dir = dir
  document.documentElement.lang = lng
  if (document.body) document.body.dir = dir
})

export default i18n
