export type AboutLanguage = 'en' | 'ar'

type AboutInsightCard = {
  title: string
  items: string[]
}

type AboutCopy = {
  roleLabel: string
  lead: string
  focusPills: string[]
  paragraphs: string[]
  insightCards: AboutInsightCard[]
  footerLabel: string
  footerText: string
}

export const aboutMeSubtitle = "I don't always have a solution, but I know how to find one"

export const aboutMeContent: Record<AboutLanguage, AboutCopy> = {
  en: {
    roleLabel: 'Full Stack Developer',
    lead: 'I work best where product thinking, system behavior, and practical debugging meet.',
    focusPills: [
      'SaaS products',
      'CRM systems',
      'Messaging platforms',
      'Frontend + Backend',
      'Integrations',
      'Datadog',
      'Real-time flows',
      'UI/UX refinement',
    ],
    paragraphs: [
      "I’m a Full Stack Developer contributing to SaaS products, CRM systems, and messaging platforms by solving complex technical issues, improving integrations between services and applications, and enhancing product workflows across frontend and backend.",
      "My work includes debugging production issues, investigating system behavior with tools like Datadog, and resolving problems related to communication between applications, webhooks, message flows, syncing, and real-time updates when needed. I also contribute to improving existing products by adding features, updating system interfaces, and refining UI and UX to make products more usable, reliable, and polished.",
      "What sets me apart is that I’m solution-oriented and persistent when dealing with complex problems. I enjoy digging into issues, understanding how systems interact, and finding practical fixes that improve stability and product quality. I also use AI as part of my workflow to speed up research, explore better approaches, and support development while maintaining engineering quality.",
    ],
    insightCards: [],
    footerLabel: 'What matters to me',
    footerText: 'Useful fixes, stable systems, and product experiences that feel sharper after every iteration.',
  },
  ar: {
    roleLabel: 'مطور Full Stack',
    lead: 'أفضل مساحة بشتغل فيها هي النقطة اللي بيقابل فيها فهم المنتج، وسلوك السيستم، والحل العملي للمشكلة.',
    focusPills: [
      'منتجات SaaS',
      'أنظمة CRM',
      'منصات المراسلة',
      'Frontend + Backend',
      'Integrations',
      'Datadog',
      'Real-time flows',
      'تحسين UI/UX',
    ],
    paragraphs: [
      'أنا Full Stack Developer بشتغل على تطوير وتحسين منتجات SaaS وأنظمة CRM ومنصات المراسلة، من خلال حل المشكلات التقنية المعقدة، وتحسين التكاملات بين الخدمات والتطبيقات، وتطوير الـ workflows على مستوى الـ frontend والـ backend.',
      'شغلي بيشمل تتبع المشكلات في بيئة الإنتاج، وفهم سلوك السيستم باستخدام أدوات زي Datadog، وحل المشاكل المرتبطة بالتواصل بين الأنظمة، والـ webhooks، وتدفق الرسائل، والـ syncing، والـ real-time updates عند الحاجة. كمان بساهم في تطوير المنتجات القائمة عن طريق إضافة features جديدة، وتحديث واجهات النظام، وتحسين الـ UI/UX بحيث المنتج يكون أوضح، أسهل في الاستخدام، وأكثر استقرارًا.',
      'اللي بيميزني إني شخص بحب أوصل للحل، خصوصًا في المشاكل المعقدة اللي بتكون محتاجة تتبع وفهم عميق لطريقة تفاعل الأنظمة مع بعض. باستخدم الذكاء الاصطناعي كجزء من الـ workflow بتاعي علشان أسرّع البحث، وأستكشف حلول أفضل، وأدعم عملية التطوير بدون ما أضحّي بجودة الشغل الهندسية.',
    ],
    insightCards: [],
    footerLabel: 'اللي يهمني',
    footerText: 'حلول مفيدة، وسيستم أكثر ثباتًا، وتجربة منتج أهدأ وأوضح مع كل تحسين جديد.',
  },
}
