/**
 * Portfolio data — single source of truth for domain content.
 *
 * Edit this file to update personal info, projects, experience, education,
 * skills, certifications, testimonials, and social links across all three
 * languages. UI chrome (nav labels, form copy, buttons) lives in
 * `messages/*.json` and is managed via next-intl.
 *
 * Access pattern from components:
 *
 *   import { portfolioData, pick, type Locale } from "@/lib/data";
 *   const locale = useLocale() as Locale;
 *   const title  = pick(portfolioData.personal.title, locale);
 */

import { routing } from "@/i18n/routing";

// ─── Locale & localization primitives ──────────────────────────────────────

export type Locale = (typeof routing.locales)[number];

/**
 * Multi-locale string. TypeScript enforces that every supported locale is
 * present at compile time — drop a key and the build fails. Add a new locale
 * to `routing.ts` and TS will surface every entry that needs translating.
 */
export type Localized = Record<Locale, string>;

/**
 * Multi-locale list. Use for bulleted features, responsibilities, etc.
 * Length doesn't need to match across locales — each translation is free
 * to phrase items naturally.
 */
export type LocalizedList = Record<Locale, readonly string[]>;

/** Pick the value for the requested locale, with a graceful EN fallback. */
export function pick(value: Localized, locale: Locale): string {
  return value[locale] || value.en;
}

/** Pick the list for the requested locale, with a graceful EN fallback. */
export function pickList(value: LocalizedList, locale: Locale): readonly string[] {
  return value[locale] ?? value.en;
}

// ─── Type definitions ──────────────────────────────────────────────────────

export type ProjectCategory = "mobile" | "web" | "fullstack";
export type ProjectStatus = "published" | "in-progress" | "archived";

export type SkillCategory =
  | "mobile"
  | "backend"
  | "frontend"
  | "databases"
  | "cloud"
  | "tools"
  | "architecture";

export type SkillLevel = "Expert" | "Advanced" | "Intermediate" | "Beginner";

export type LanguageProficiency =
  | "Native"
  | "Fluent"
  | "Professional"
  | "Intermediate"
  | "Basic";

/** Outbound links a project can ship to. Empty strings are treated as absent. */
export interface ProjectLinks {
  playStore?: string;
  appStore?: string;
  github?: string;
  live?: string;
  caseStudy?: string;
}

export interface Project {
  /** Stable URL-safe slug. Used as the dynamic route segment `/projects/[id]`. */
  id: string;
  category: ProjectCategory;
  status: ProjectStatus;
  /** Lower-is-earlier — controls the order on the listing page. */
  order: number;
  /** Pin to the homepage "Selected projects" strip. */
  featured: boolean;

  title: Localized;
  subtitle: Localized;
  /** Short blurb (~30 words) for cards. */
  description: Localized;
  /** Long-form copy (~150–250 words) for the project detail page. */
  fullDescription: Localized;

  /** Feature bullets shown on the detail page. */
  features: LocalizedList;
  /** Short highlight pills (e.g. "Production Ready"). */
  highlights: LocalizedList;
  /** Pull-quote / soundbite from a stakeholder. */
  testimonial?: Localized;

  /** Tech stack tokens (brand names — not translated). */
  technologies: readonly string[];
  /** Translated role title (e.g. "Lead Mobile Developer"). */
  role: Localized;
  /** Translated freeform duration (e.g. "3 months"). */
  duration: Localized;

  /** Hero image path under `/public`. */
  image: string;
  /** Gallery screenshots. */
  images: readonly string[];

  links: ProjectLinks;
}

export interface SkillItem {
  name: string;
  level: SkillLevel;
  /** Self-assessed proficiency, 0–100. Drives bar / ring visualizations. */
  percentage: number;
}

export interface SkillGroup {
  category: SkillCategory;
  title: Localized;
  /** Mixed shape — primary categories carry levels, flat groups are strings. */
  items: readonly (SkillItem | string)[];
}

export interface ExperienceEntry {
  id: number;
  position: Localized;
  company: string;
  /** Optional company URL. */
  companyUrl?: string;
  location: Localized;
  /** Freeform start/end strings — keep locale-friendly ("June 2025" / "juin 2025"). */
  startDate: Localized;
  endDate: Localized;
  /** Computed duration string, also localized. */
  duration: Localized;
  current: boolean;
  description: Localized;
  responsibilities: LocalizedList;
  technologies: readonly string[];
}

export interface EducationEntry {
  id: number;
  degree: Localized;
  institution: Localized;
  university: Localized;
  location: Localized;
  completionDate: string;
  description: Localized;
}

export interface Certification {
  title: Localized;
  issuer: Localized;
  date: string;
  description: Localized;
}

export interface LanguageSkill {
  /** ISO 639-1 code. */
  code: "en" | "fr" | "ar";
  /** Translated language name. */
  name: Localized;
  level: LanguageProficiency;
  percentage: number;
}

export interface Testimonial {
  id: number;
  author: string;
  position: Localized;
  company: string;
  quote: Localized;
  rating: 1 | 2 | 3 | 4 | 5;
}

export interface PersonalInfo {
  fullName: string;
  title: Localized;
  /** Rotating job-title phrases shown under the name in the hero. */
  titles: LocalizedList;
  subtitle: Localized;
  location: Localized;
  bio: Localized;
  shortBio: Localized;
  email: string;
  phone: string;
  yearsExperience: number;
  avatar: string;
  backgroundImage: string;
  resumeUrl?: string;
}

export interface SocialLinks {
  linkedin: string;
  github: string;
  email: string;
  phone: string;
  portfolio?: string;
  twitter?: string;
  instagram?: string;
}

export interface SeoMetadata {
  title: Localized;
  description: Localized;
  keywords: readonly string[];
}

// ─── Personal ──────────────────────────────────────────────────────────────

const personal: PersonalInfo = {
  fullName: "Adel Labdelli Merioua",
  title: {
    en: "Full-Stack Developer & Flutter Expert",
    fr: "Développeur Full-Stack & Expert Flutter",
    ar: "مطوّر متكامل وخبير Flutter",
  },
  titles: {
    en: [
      "Flutter Expert",
      "Full-Stack Developer",
      "Mobile App Specialist",
      "UI Designer",
    ],
    fr: [
      "Expert Flutter",
      "Développeur full-stack",
      "Spécialiste des apps mobiles",
      "Designer UI",
    ],
    ar: [
      "خبير Flutter",
      "مطوّر متكامل",
      "متخصّص تطبيقات الموبايل",
      "مصمّم واجهات",
    ],
  },
  subtitle: {
    en: "Flutter · Web Development · UI Design",
    fr: "Flutter · Développement Web · Design UI",
    ar: "Flutter · تطوير الويب · تصميم الواجهات",
  },
  location: {
    en: "Doha, Qatar",
    fr: "Doha, Qatar",
    ar: "الدوحة، قطر",
  },
  bio: {
    en: "Mobile Application Developer with 5+ years of experience specializing in Flutter and cross-platform development. Expert in building scalable, high-performance applications with modern architecture patterns. Also proficient in full-stack web development, UI/UX design, and cloud deployment.",
    fr: "Développeur d'applications mobiles avec plus de 5 ans d'expérience, spécialisé en Flutter et en développement multiplateforme. Expert dans la conception d'applications évolutives et performantes avec des patterns d'architecture modernes. Également compétent en développement web full-stack, en design UI/UX et en déploiement cloud.",
    ar: "مطوّر تطبيقات موبايل بخبرة تتجاوز خمس سنوات، متخصّص في Flutter والتطوير متعدّد المنصّات. خبير في بناء تطبيقات قابلة للتوسّع وعالية الأداء بأنماط معمارية حديثة. كذلك متمكّن من تطوير الويب المتكامل وتصميم تجربة وواجهة المستخدم والنشر السحابي.",
  },
  shortBio: {
    en: "Full-Stack Developer crafting beautiful, performant mobile and web applications with modern technologies.",
    fr: "Développeur full-stack qui conçoit des applications mobiles et web élégantes et performantes avec des technologies modernes.",
    ar: "مطوّر متكامل يصنع تطبيقات موبايل وويب أنيقة وعالية الأداء بأحدث التقنيات.",
  },
  email: "meriouaadel22@gmail.com",
  phone: "+974 6005 9654",
  yearsExperience: 5,
  avatar: "/images/avatar.jpg",
  backgroundImage: "/images/hero-bg.jpg",
};

// ─── Projects ──────────────────────────────────────────────────────────────

const projects: readonly Project[] = [
  {
    id: "awashz",
    category: "mobile",
    status: "published",
    order: 1,
    featured: true,
    title: {
      en: "AwashZ — On-Demand Car Wash & Auto Services",
      fr: "AwashZ — Service de Lavage Auto à la Demande",
      ar: "أوشز — خدمات غسيل السيارات وصيانتها عند الطلب",
    },
    subtitle: {
      en: "Location-based mobile service platform",
      fr: "Plateforme mobile de services basée sur la localisation",
      ar: "منصّة خدمات للهاتف المحمول مبنيّة على الموقع الجغرافي",
    },
    description: {
      en: "A production-ready Flutter app that lets users book professional car wash and auto services delivered to their location.",
      fr: "Une application Flutter de qualité production qui permet aux utilisateurs de réserver des services de lavage et d'entretien automobile livrés à leur emplacement.",
      ar: "تطبيق Flutter بجودة الإنتاج يتيح للمستخدمين حجز خدمات غسيل وصيانة السيارات وتوصيلها إلى موقعهم.",
    },
    fullDescription: {
      en: "AwashZ is a comprehensive on-demand service platform built with Flutter that revolutionizes how users access car wash and auto services. The app pairs end-customers with verified service providers in real time, with GPS tracking from booking to completion. Secure payment processing covers card, wallet, and cash-on-delivery flows, and an admin dashboard gives operators a single view of bookings, providers, and earnings. Push notifications via Firebase Cloud Messaging keep customers informed at every step — confirmation, technician en-route, on-site, and completion — while a built-in rating and review system continually surfaces top performers. The codebase follows clean architecture with Provider state management, comprehensive error handling, and offline-first patterns where possible, making the experience reliable even on flaky connections.",
      fr: "AwashZ est une plateforme de services à la demande complète conçue avec Flutter, qui réinvente l'accès aux services de lavage et d'entretien automobile. L'application met en relation les clients et des prestataires vérifiés en temps réel, avec un suivi GPS de la réservation jusqu'à la fin de la prestation. Le traitement des paiements couvre la carte bancaire, le portefeuille numérique et le paiement à la livraison ; un tableau de bord d'administration offre aux opérateurs une vue unifiée des réservations, des prestataires et des revenus. Les notifications push via Firebase Cloud Messaging tiennent les clients informés à chaque étape — confirmation, technicien en route, sur place, et fin de prestation — tandis qu'un système intégré de notes et d'avis met en avant les meilleurs profils. Le code suit une architecture propre avec la gestion d'état Provider, une gestion exhaustive des erreurs et des patterns « offline-first » lorsque possible, garantissant une expérience fiable même sur connexion instable.",
      ar: "أوشز منصّة خدمات شاملة عند الطلب مبنية بـ Flutter، تُعيد تعريف كيفية حصول المستخدمين على خدمات غسيل وصيانة السيارات. يربط التطبيق العملاء بمزوّدي خدمة معتمدين في الوقت الفعلي، مع تتبّع GPS من لحظة الحجز حتى انتهاء الخدمة. تشمل المعالجة الآمنة للمدفوعات البطاقات المصرفية والمحفظة الرقمية والدفع عند الاستلام، فيما تمنح لوحة تحكّم المسؤولين رؤيةً موحّدة للحجوزات والمزوّدين والإيرادات. تُبقي إشعارات FCM العملاءَ على اطّلاع في كل مرحلة — تأكيد، الفنّي في الطريق، في الموقع، اكتمال — ويُبرز نظام التقييم والمراجعات المدمج أفضل المزوّدين باستمرار. تتبع الشيفرة معمارية نظيفة مع إدارة حالة عبر Provider، ومعالجة شاملة للأخطاء، وأنماط تعمل دون اتصال حيثما أمكن لتجربة موثوقة حتى في الشبكات غير المستقرّة.",
    },
    features: {
      en: [
        "Real-time service booking with instant confirmation",
        "GPS tracking and location-based service discovery",
        "Secure payment processing integration",
        "Appointment scheduling and reminders via FCM",
        "Service provider management dashboard",
        "Rating and review system",
        "Real-time notifications and updates",
      ],
      fr: [
        "Réservation de service en temps réel avec confirmation instantanée",
        "Suivi GPS et découverte de services basée sur la localisation",
        "Intégration sécurisée du traitement des paiements",
        "Planification des rendez-vous et rappels via FCM",
        "Tableau de bord de gestion pour les prestataires",
        "Système de notes et d'avis",
        "Notifications et mises à jour en temps réel",
      ],
      ar: [
        "حجز فوريّ للخدمات مع تأكيد مباشر",
        "تتبّع GPS واكتشاف الخدمات بناءً على الموقع",
        "تكامل آمن لمعالجة المدفوعات",
        "جدولة المواعيد والتذكيرات عبر FCM",
        "لوحة إدارة لمزوّدي الخدمة",
        "نظام تقييم ومراجعات",
        "إشعارات وتحديثات فوريّة",
      ],
    },
    highlights: {
      en: ["Production Ready", "Published on Play Store", "Real-time Services", "Payment Integration"],
      fr: ["Prêt pour la production", "Publié sur Play Store", "Services en temps réel", "Paiements intégrés"],
      ar: ["جاهز للإنتاج", "منشور على Play Store", "خدمات فوريّة", "تكامل المدفوعات"],
    },
    testimonial: {
      en: "High-performance app with smooth UX and reliable service delivery.",
      fr: "Application performante, expérience utilisateur fluide et livraison de service fiable.",
      ar: "تطبيق عالي الأداء بتجربة استخدام سلسة وتوصيل خدمة موثوق.",
    },
    technologies: ["Flutter", "Dart", "Firebase", "FCM", "REST API", "Google Maps API"],
    role: {
      en: "Lead Mobile Developer",
      fr: "Développeur mobile principal",
      ar: "مطوّر موبايل رئيسي",
    },
    duration: { en: "3 months", fr: "3 mois", ar: "3 أشهر" },
    image: "/images/projects/awashz.jpg",
    // Add screenshots to `public/images/projects/` (e.g. awashz-1.jpg …) and
    // list them here to populate the gallery on the project detail page.
    images: [],
    links: {
      playStore: "https://play.google.com/store/apps/details?id=com.fiveline.awaashz",
    },
  },
  {
    id: "glamix",
    category: "mobile",
    status: "published",
    order: 2,
    featured: true,
    title: {
      en: "Glamix — Salon Booking & Appointment Management",
      fr: "Glamix — Réservation de salons et gestion des rendez-vous",
      ar: "غلاميكس — حجز الصالونات وإدارة المواعيد",
    },
    subtitle: {
      en: "Professional salon services discovery platform",
      fr: "Plateforme professionnelle de découverte de services de salons",
      ar: "منصّة احترافية لاكتشاف خدمات الصالونات",
    },
    description: {
      en: "A salon-services marketplace app with real-time availability, integrated payments, and intelligent appointment reminders.",
      fr: "Une marketplace de services de salons avec disponibilité en temps réel, paiements intégrés et rappels de rendez-vous intelligents.",
      ar: "تطبيق سوق لخدمات الصالونات بتوافر آنيّ ومدفوعات متكاملة وتذكيرات ذكية للمواعيد.",
    },
    fullDescription: {
      en: "Glamix is a sophisticated salon and grooming services marketplace. End-users can discover nearby salons, browse services with rich imagery, check live availability, and book appointments in a few taps. The app integrates secure payment processing and ships a comprehensive review and rating system so users can choose with confidence. Push notification reminders keep clients on time, and a dedicated service-provider dashboard lets salons manage appointments, edit availability, and respond to bookings in real time. Built with Flutter and Dart on a Firebase backend, the app uses Provider and BLoC for state management, follows clean architecture, and includes search filters, favourites, and an in-app messaging path for last-minute coordination. The two-sided marketplace pattern is enforced end-to-end — separate flows, separate analytics, separate notifications.",
      fr: "Glamix est une marketplace sophistiquée de services de salons et de beauté. Les utilisateurs peuvent découvrir des salons à proximité, parcourir les prestations avec des visuels riches, vérifier la disponibilité en direct et réserver un rendez-vous en quelques pressions. L'application intègre un traitement des paiements sécurisé et un système complet d'avis et de notes pour aider les utilisateurs à choisir en confiance. Les rappels push gardent les clients à l'heure, et un tableau de bord dédié aux prestataires permet aux salons de gérer les rendez-vous, d'ajuster les disponibilités et de répondre aux réservations en temps réel. Conçue avec Flutter et Dart sur un backend Firebase, l'application utilise Provider et BLoC pour la gestion d'état, suit une architecture propre et inclut filtres de recherche, favoris et un canal de messagerie intégré pour la coordination de dernière minute. Le modèle de marketplace à deux côtés est appliqué de bout en bout — flux, analytiques et notifications séparés.",
      ar: "غلاميكس سوق إلكتروني متطوّر لخدمات الصالونات والعناية الشخصية. يستطيع المستخدمون اكتشاف الصالونات القريبة وتصفّح الخدمات بصور غنيّة والاطّلاع على التوافر المباشر وحجز المواعيد بنقرات قليلة. يدمج التطبيق معالجةً آمنة للمدفوعات ونظامًا شاملًا للتقييمات والمراجعات يساعد المستخدمين على الاختيار بثقة. تُبقي التذكيرات الفورية العملاءَ ملتزمين بمواعيدهم، فيما تُتيح لوحة مخصّصة للصالونات إدارة المواعيد وتعديل التوافر والاستجابة للحجوزات لحظيًّا. مبنيّ بـ Flutter و Dart على واجهة Firebase الخلفية، ويستخدم Provider و BLoC لإدارة الحالة، ويتّبع معمارية نظيفة، ويشمل فلاتر بحث ومفضّلات وقناة مراسلات داخلية للتنسيق في اللحظات الأخيرة. يُطبَّق نمط السوق ذي الطرفين من البداية إلى النهاية — تدفقات منفصلة وتحليلات منفصلة وإشعارات منفصلة.",
    },
    features: {
      en: [
        "Service discovery with filters and search",
        "Real-time appointment availability",
        "Secure booking confirmation system",
        "Integrated payment processing",
        "User reviews and ratings",
        "Appointment reminders and notifications",
        "Salon management dashboard",
        "Real-time availability updates",
      ],
      fr: [
        "Découverte des services avec filtres et recherche",
        "Disponibilité des rendez-vous en temps réel",
        "Système de confirmation de réservation sécurisé",
        "Traitement des paiements intégré",
        "Avis et notes des utilisateurs",
        "Rappels de rendez-vous et notifications",
        "Tableau de bord de gestion pour les salons",
        "Mises à jour de disponibilité en temps réel",
      ],
      ar: [
        "اكتشاف الخدمات بفلاتر وبحث",
        "توافر آنيّ للمواعيد",
        "نظام تأكيد حجوزات آمن",
        "معالجة مدفوعات متكاملة",
        "تقييمات ومراجعات المستخدمين",
        "تذكيرات المواعيد والإشعارات",
        "لوحة إدارة لصالونات التجميل",
        "تحديثات توافر فوريّة",
      ],
    },
    highlights: {
      en: ["Two-Sided Marketplace", "Real-time Updates", "Appointment System", "Published App"],
      fr: ["Marketplace bilatérale", "Mises à jour en temps réel", "Système de rendez-vous", "Application publiée"],
      ar: ["سوق ذو طرفين", "تحديثات فوريّة", "نظام مواعيد", "تطبيق منشور"],
    },
    testimonial: {
      en: "Intuitive interface with powerful booking management features.",
      fr: "Interface intuitive avec des fonctionnalités de gestion de réservation puissantes.",
      ar: "واجهة بديهية مع ميزات قوية لإدارة الحجوزات.",
    },
    technologies: ["Flutter", "Dart", "Firebase", "REST API", "Payment Gateway"],
    role: {
      en: "Full-Stack Mobile Developer",
      fr: "Développeur mobile full-stack",
      ar: "مطوّر موبايل متكامل",
    },
    duration: { en: "2.5 months", fr: "2,5 mois", ar: "شهران ونصف" },
    image: "/images/projects/glamix.jpg",
    // Add screenshots to `public/images/projects/` (e.g. glamix-1.jpg …) and
    // list them here to populate the gallery on the project detail page.
    images: [],
    links: {
      playStore: "https://play.google.com/store/apps/details?id=com.fiveline.glamix",
    },
  },
  {
    id: "discount-plus",
    category: "mobile",
    status: "published",
    order: 3,
    featured: true,
    title: {
      en: "Discount Plus — Digital Discounts & Membership Platform",
      fr: "Discount Plus — Plateforme de remises et d'adhésions numériques",
      ar: "ديسكاونت بلس — منصّة الخصومات الرقمية والعضويات",
    },
    subtitle: {
      en: "Smart discount aggregation and digital membership system",
      fr: "Agrégation intelligente d'offres et système d'adhésion numérique",
      ar: "تجميع ذكي للعروض ونظام عضوية رقمية",
    },
    description: {
      en: "A discount platform that lets users discover offers from nearby businesses and redeem them with QR or barcode-based digital membership.",
      fr: "Une plateforme de remises permettant aux utilisateurs de découvrir des offres de commerces à proximité et de les utiliser via une adhésion numérique par QR ou code-barres.",
      ar: "منصّة خصومات تتيح للمستخدمين اكتشاف عروض من المتاجر القريبة واستردادها عبر عضوية رقمية بـ QR أو الباركود.",
    },
    fullDescription: {
      en: "Discount Plus is an innovative mobile platform that bridges the gap between local businesses and consumers. Shoppers discover exclusive offers from nearby merchants, then redeem them at checkout using a digital membership card with QR/barcode scanning. The platform features real-time offer synchronization across devices, comprehensive activity tracking, savings insights so users can see what they've earned over time, and secure authentication. On the merchant side, businesses get detailed analytics on redemptions and customer engagement, plus a self-serve portal for issuing time-bound deals. Built cross-platform in Flutter with Firebase Realtime Database powering the live sync, the app ships on both the App Store and Google Play and follows clean architecture with Provider for state management. QR/barcode scanning uses native camera APIs through Flutter plugins for reliable, low-latency reads even on older devices.",
      fr: "Discount Plus est une plateforme mobile innovante qui rapproche les commerces locaux et les consommateurs. Les clients découvrent des offres exclusives de commerces à proximité, puis les utilisent en caisse via une carte d'adhésion numérique avec scan QR/code-barres. La plateforme propose une synchronisation des offres en temps réel sur tous les appareils, un suivi d'activité complet, des indicateurs d'économies montrant ce que l'utilisateur a gagné dans le temps, et une authentification sécurisée. Côté commerçant, les entreprises bénéficient d'analyses détaillées sur les utilisations et l'engagement client, ainsi que d'un portail en libre-service pour publier des offres à durée limitée. Conçue en multiplateforme avec Flutter sur Firebase Realtime Database pour la synchronisation en direct, l'application est disponible sur l'App Store et sur Google Play et suit une architecture propre avec Provider pour la gestion d'état. La lecture QR/code-barres s'appuie sur les API caméra natives via des plugins Flutter pour des scans fiables et à faible latence, même sur des appareils anciens.",
      ar: "ديسكاونت بلس منصّة محمولة مبتكرة تردم الفجوة بين المتاجر المحلّية والمستهلكين. يكتشف المتسوّقون عروضًا حصريّة من تجّار قريبين، ثم يستخدمونها عند الدفع عبر بطاقة عضوية رقمية بمسح QR أو باركود. تتميّز المنصّة بمزامنة فوريّة للعروض عبر الأجهزة، وتتبّع شامل للنشاط، ومؤشّرات للوفر تُظهر للمستخدم ما حقّقه عبر الزمن، ومصادقة آمنة. على جانب التاجر، يحصل الأعمال على تحليلات تفصيلية حول الاستخدامات وتفاعل العملاء، وبوّابة ذاتية الخدمة لإصدار عروض محدّدة الزمن. مبنيّ متعدّد المنصّات بـ Flutter مع Firebase Realtime Database لمزامنة لحظية، ومنشور على App Store و Google Play، ويتّبع معمارية نظيفة مع Provider لإدارة الحالة. يعتمد مسح QR/الباركود على واجهات الكاميرا الأصلية عبر إضافات Flutter لقراءات موثوقة سريعة الاستجابة حتى على الأجهزة القديمة.",
    },
    features: {
      en: [
        "Real-time offer discovery and synchronization",
        "QR/Barcode scanning for digital redemption",
        "Digital membership card management",
        "Savings tracking and insights",
        "Nearby business discovery",
        "User activity and purchase history",
        "Secure authentication",
        "Business analytics dashboard",
      ],
      fr: [
        "Découverte et synchronisation des offres en temps réel",
        "Scan QR/code-barres pour l'utilisation numérique",
        "Gestion de la carte d'adhésion numérique",
        "Suivi des économies et indicateurs",
        "Découverte des commerces à proximité",
        "Historique d'activité et d'achats",
        "Authentification sécurisée",
        "Tableau de bord d'analytique pour les commerces",
      ],
      ar: [
        "اكتشاف ومزامنة العروض في الوقت الفعلي",
        "مسح QR / باركود للاستخدام الرقمي",
        "إدارة بطاقة العضوية الرقمية",
        "تتبّع الوفر ومؤشّراته",
        "اكتشاف المتاجر القريبة",
        "سجلّ النشاط والمشتريات",
        "مصادقة آمنة",
        "لوحة تحليلات للمتاجر",
      ],
    },
    highlights: {
      en: ["Cross-Platform (iOS & Android)", "Real-time Sync", "QR Code Integration", "Dual App Stores"],
      fr: ["Multiplateforme (iOS & Android)", "Synchronisation en temps réel", "Intégration QR code", "Présent sur les deux stores"],
      ar: ["متعدّد المنصّات (iOS و Android)", "مزامنة فوريّة", "تكامل QR", "متاح على المتجرين"],
    },
    testimonial: {
      en: "Seamless user experience with powerful real-time data synchronization.",
      fr: "Expérience utilisateur fluide avec une synchronisation des données en temps réel performante.",
      ar: "تجربة استخدام سلسة مع مزامنة بيانات فوريّة قوية.",
    },
    technologies: ["Flutter", "Dart", "Firebase Realtime Database", "REST API", "QR/Barcode Scanning"],
    role: {
      en: "Lead Mobile Developer",
      fr: "Développeur mobile principal",
      ar: "مطوّر موبايل رئيسي",
    },
    duration: { en: "2 months", fr: "2 mois", ar: "شهران" },
    image: "/images/projects/discount-plus.jpg",
    images: [
      "/images/projects/discount-plus-1.png",
      "/images/projects/discount-plus-2.png",
      "/images/projects/discount-plus-3.png",
      "/images/projects/discount-plus-4.png",
      "/images/projects/discount-plus-5.png",
      "/images/projects/discount-plus-6.png",
      "/images/projects/discount-plus-7.png",
    ],
    links: {
      playStore: "https://play.google.com/store/apps/details?id=com.fiveline.discountplus",
      appStore: "https://apps.apple.com/us/app/discount/id6763311834",
    },
  },
] as const;

// ─── Skills ────────────────────────────────────────────────────────────────

const skills: readonly SkillGroup[] = [
  {
    category: "mobile",
    title: {
      en: "Mobile Development",
      fr: "Développement mobile",
      ar: "تطوير الموبايل",
    },
    items: [
      { name: "Flutter", level: "Expert", percentage: 95 },
      { name: "Dart", level: "Expert", percentage: 95 },
      { name: "iOS Development", level: "Advanced", percentage: 85 },
      { name: "Android Development", level: "Advanced", percentage: 85 },
      { name: "Provider State Management", level: "Expert", percentage: 90 },
      { name: "BLoC Pattern", level: "Advanced", percentage: 85 },
    ],
  },
  {
    category: "backend",
    title: {
      en: "Backend Development",
      fr: "Développement backend",
      ar: "تطوير الواجهة الخلفية",
    },
    items: [
      { name: "Node.js", level: "Advanced", percentage: 85 },
      { name: "Express.js", level: "Advanced", percentage: 85 },
      { name: "NestJS", level: "Advanced", percentage: 80 },
      { name: "Java", level: "Intermediate", percentage: 70 },
      { name: "Kotlin", level: "Intermediate", percentage: 70 },
      { name: "RESTful APIs", level: "Expert", percentage: 90 },
    ],
  },
  {
    category: "frontend",
    title: {
      en: "Frontend Web Development",
      fr: "Développement web frontend",
      ar: "تطوير واجهة الويب",
    },
    items: [
      { name: "JavaScript (ES6+)", level: "Advanced", percentage: 85 },
      { name: "TypeScript", level: "Advanced", percentage: 80 },
      { name: "React", level: "Advanced", percentage: 80 },
      { name: "Responsive Design", level: "Expert", percentage: 90 },
      { name: "Material Design", level: "Expert", percentage: 92 },
    ],
  },
  {
    category: "databases",
    title: {
      en: "Databases",
      fr: "Bases de données",
      ar: "قواعد البيانات",
    },
    items: [
      { name: "Firebase", level: "Expert", percentage: 92 },
      { name: "MongoDB", level: "Advanced", percentage: 85 },
      { name: "PostgreSQL", level: "Advanced", percentage: 85 },
      { name: "MySQL", level: "Advanced", percentage: 80 },
      { name: "Supabase", level: "Advanced", percentage: 80 },
    ],
  },
  {
    category: "cloud",
    title: {
      en: "Cloud & DevOps",
      fr: "Cloud & DevOps",
      ar: "السحابة و DevOps",
    },
    items: [
      { name: "GCP", level: "Advanced", percentage: 80 },
      { name: "AWS", level: "Intermediate", percentage: 75 },
      { name: "Docker", level: "Advanced", percentage: 85 },
      { name: "GitHub Actions", level: "Intermediate", percentage: 75 },
      { name: "PM2", level: "Intermediate", percentage: 70 },
    ],
  },
  {
    category: "tools",
    title: {
      en: "Tools & Platforms",
      fr: "Outils & plateformes",
      ar: "الأدوات والمنصّات",
    },
    items: [
      "Git & GitHub",
      "VS Code",
      "Postman",
      "Swagger/OpenAPI",
      "Linux",
      "Firebase Console",
      "Google Cloud Console",
      "AWS Console",
    ],
  },
  {
    category: "architecture",
    title: {
      en: "Architecture & Patterns",
      fr: "Architecture & patterns",
      ar: "المعمارية والأنماط",
    },
    items: [
      "Clean Architecture",
      "MVC Architecture",
      "BLoC Pattern",
      "Provider State Management",
      "Microservices",
      "JWT Authentication",
      "Role-Based Access Control (RBAC)",
      "Secure REST API Design",
    ],
  },
] as const;

// ─── Experience ────────────────────────────────────────────────────────────

const experience: readonly ExperienceEntry[] = [
  {
    id: 1,
    position: {
      en: "Flutter Developer",
      fr: "Développeur Flutter",
      ar: "مطوّر Flutter",
    },
    company: "Fiveline Website Solutions",
    location: {
      en: "Doha, Qatar",
      fr: "Doha, Qatar",
      ar: "الدوحة، قطر",
    },
    startDate: { en: "June 2025", fr: "juin 2025", ar: "يونيو 2025" },
    endDate: { en: "Present", fr: "Présent", ar: "الآن" },
    duration: { en: "3 months", fr: "3 mois", ar: "3 أشهر" },
    current: true,
    description: {
      en: "Developing cross-platform mobile applications using Flutter and Dart with a focus on performance and scalability.",
      fr: "Développement d'applications mobiles multiplateformes avec Flutter et Dart, en privilégiant la performance et l'évolutivité.",
      ar: "تطوير تطبيقات موبايل متعدّدة المنصّات باستخدام Flutter و Dart مع التركيز على الأداء وقابلية التوسّع.",
    },
    responsibilities: {
      en: [
        "Develop cross-platform mobile applications using Flutter and Dart",
        "Integrate RESTful APIs and Firebase services",
        "Implement state management solutions (Provider, BLoC)",
        "Design responsive UI following Material and Cupertino guidelines",
        "Ensure code quality through clean code practices and testing",
        "Optimize application performance",
        "Collaborate with team using Git for version control",
      ],
      fr: [
        "Développer des applications mobiles multiplateformes avec Flutter et Dart",
        "Intégrer des API REST et les services Firebase",
        "Mettre en œuvre la gestion d'état (Provider, BLoC)",
        "Concevoir des interfaces réactives selon les guidelines Material et Cupertino",
        "Garantir la qualité du code via clean code et tests",
        "Optimiser les performances applicatives",
        "Collaborer en équipe via Git pour la gestion de versions",
      ],
      ar: [
        "تطوير تطبيقات موبايل متعدّدة المنصّات بـ Flutter و Dart",
        "دمج واجهات REST وخدمات Firebase",
        "تطبيق حلول إدارة الحالة (Provider و BLoC)",
        "تصميم واجهات متجاوبة وفق إرشادات Material و Cupertino",
        "ضمان جودة الشيفرة عبر ممارسات الكود النظيف والاختبار",
        "تحسين أداء التطبيقات",
        "التعاون مع الفريق باستخدام Git لإدارة الإصدارات",
      ],
    },
    technologies: ["Flutter", "Dart", "Firebase", "Provider", "BLoC", "REST API"],
  },
  {
    id: 2,
    position: {
      en: "Mobile Application Developer (Contract — Project Based)",
      fr: "Développeur d'applications mobiles (contrat — par projet)",
      ar: "مطوّر تطبيقات موبايل (عقد — قائم على المشروع)",
    },
    company: "Lamlan Digital Solutions",
    location: {
      en: "Doha, Qatar",
      fr: "Doha, Qatar",
      ar: "الدوحة، قطر",
    },
    startDate: { en: "Mar 2025", fr: "mars 2025", ar: "مارس 2025" },
    endDate: { en: "June 2025", fr: "juin 2025", ar: "يونيو 2025" },
    duration: { en: "3 months", fr: "3 mois", ar: "3 أشهر" },
    current: false,
    description: {
      en: "Delivered Flutter-based mobile applications on a project-contract basis with focus on end-to-end feature implementation.",
      fr: "Livraison d'applications mobiles Flutter en contrat de projet, axée sur l'implémentation de fonctionnalités de bout en bout.",
      ar: "تسليم تطبيقات موبايل مبنيّة بـ Flutter بنظام العقد القائم على المشروع، مع التركيز على التنفيذ الشامل للميزات.",
    },
    responsibilities: {
      en: [
        "End-to-end feature implementation and delivery",
        "Integrate RESTful APIs and Firebase services",
        "Apply state management patterns (Provider, BLoC)",
        "Build production-ready responsive UI",
        "Optimize performance and ensure code quality",
        "Collaborate with cross-functional teams",
        "Version control and task tracking with Git",
      ],
      fr: [
        "Implémentation et livraison de fonctionnalités de bout en bout",
        "Intégration d'API REST et de services Firebase",
        "Application des patterns de gestion d'état (Provider, BLoC)",
        "Construction d'interfaces réactives prêtes pour la production",
        "Optimisation des performances et qualité du code",
        "Collaboration avec des équipes pluridisciplinaires",
        "Gestion de versions et suivi des tâches via Git",
      ],
      ar: [
        "تنفيذ وتسليم ميزات من البداية إلى النهاية",
        "دمج واجهات REST وخدمات Firebase",
        "تطبيق أنماط إدارة الحالة (Provider و BLoC)",
        "بناء واجهات متجاوبة بجودة إنتاج",
        "تحسين الأداء وضمان جودة الشيفرة",
        "التعاون مع فرق متعدّدة التخصّصات",
        "إدارة الإصدارات وتتبّع المهام عبر Git",
      ],
    },
    technologies: ["Flutter", "Dart", "Firebase", "Provider", "BLoC", "Material Design"],
  },
  {
    id: 3,
    position: {
      en: "Mobile Application Developer",
      fr: "Développeur d'applications mobiles",
      ar: "مطوّر تطبيقات موبايل",
    },
    company: "SATL DOWAYA",
    location: {
      en: "Sidi Bel Abbes, Algeria",
      fr: "Sidi Bel Abbès, Algérie",
      ar: "سيدي بلعباس، الجزائر",
    },
    startDate: { en: "Jul 2024", fr: "juil. 2024", ar: "يوليو 2024" },
    endDate: { en: "Mar 2025", fr: "mars 2025", ar: "مارس 2025" },
    duration: { en: "8 months", fr: "8 mois", ar: "8 أشهر" },
    current: false,
    description: {
      en: "Built and deployed production Flutter applications for iOS and Android platforms.",
      fr: "Conception et déploiement d'applications Flutter de production sur iOS et Android.",
      ar: "بناء ونشر تطبيقات Flutter للإنتاج على iOS و Android.",
    },
    responsibilities: {
      en: [
        "Build and deploy production Flutter apps",
        "Develop custom UI using Material Design",
        "Integrate backend APIs and third-party packages",
        "Ensure cross-team collaboration",
        "Meet project timelines and delivery standards",
      ],
      fr: [
        "Construire et déployer des apps Flutter de production",
        "Développer des UI sur mesure avec Material Design",
        "Intégrer des API backend et des packages tiers",
        "Assurer la collaboration entre équipes",
        "Respecter les délais et les standards de livraison",
      ],
      ar: [
        "بناء ونشر تطبيقات Flutter جاهزة للإنتاج",
        "تطوير واجهات مخصّصة بـ Material Design",
        "دمج واجهات الخلفية البرمجية وحزم الأطراف الثالثة",
        "ضمان التعاون بين الفرق",
        "الالتزام بالجداول الزمنية ومعايير التسليم",
      ],
    },
    technologies: ["Flutter", "Dart", "Material Design", "APIs"],
  },
  {
    id: 4,
    position: {
      en: "Trainer (Flutter & Dart Development)",
      fr: "Formateur (développement Flutter & Dart)",
      ar: "مدرّب (تطوير Flutter و Dart)",
    },
    company: "Private School",
    location: {
      en: "Sidi Bel Abbes, Algeria",
      fr: "Sidi Bel Abbès, Algérie",
      ar: "سيدي بلعباس، الجزائر",
    },
    startDate: { en: "Sep 2022", fr: "sept. 2022", ar: "سبتمبر 2022" },
    endDate: { en: "Mar 2025", fr: "mars 2025", ar: "مارس 2025" },
    duration: { en: "2.5 years", fr: "2,5 ans", ar: "سنتان ونصف" },
    current: false,
    description: {
      en: "Delivered hands-on training in mobile application development covering Dart and Flutter.",
      fr: "Formations pratiques en développement d'applications mobiles couvrant Dart et Flutter.",
      ar: "تدريبات عملية في تطوير تطبيقات الموبايل تشمل Dart و Flutter.",
    },
    responsibilities: {
      en: [
        "Teach Dart fundamentals and advanced concepts",
        "Cover Flutter architecture and best practices",
        "Guide UI development and design patterns",
        "Implement real-world project scenarios",
        "Mentor students through capstone projects",
      ],
      fr: [
        "Enseigner les fondamentaux et les concepts avancés de Dart",
        "Couvrir l'architecture Flutter et les bonnes pratiques",
        "Guider le développement UI et les design patterns",
        "Mettre en œuvre des scénarios de projets réels",
        "Encadrer les étudiants sur les projets de fin de cursus",
      ],
      ar: [
        "تدريس أساسيات Dart ومفاهيمه المتقدّمة",
        "تغطية معمارية Flutter وأفضل الممارسات",
        "توجيه تطوير الواجهات وأنماط التصميم",
        "تنفيذ سيناريوهات مشاريع واقعية",
        "إرشاد الطلاب في مشاريع التخرّج",
      ],
    },
    technologies: ["Flutter", "Dart", "Mobile Development", "Architecture"],
  },
  {
    id: 5,
    position: {
      en: "Freelance Full-Stack Developer",
      fr: "Développeur full-stack en freelance",
      ar: "مطوّر متكامل مستقل",
    },
    company: "Self-Employed",
    location: {
      en: "Algiers, Algeria",
      fr: "Alger, Algérie",
      ar: "الجزائر العاصمة، الجزائر",
    },
    startDate: { en: "Sep 2019", fr: "sept. 2019", ar: "سبتمبر 2019" },
    endDate: { en: "Sep 2022", fr: "sept. 2022", ar: "سبتمبر 2022" },
    duration: { en: "3 years", fr: "3 ans", ar: "3 سنوات" },
    current: false,
    description: {
      en: "Full-Stack Developer building and maintaining web and mobile applications with a focus on performance.",
      fr: "Développeur full-stack concevant et maintenant des applications web et mobiles, axé sur la performance.",
      ar: "مطوّر متكامل يبني ويصون تطبيقات الويب والموبايل مع التركيز على الأداء.",
    },
    responsibilities: {
      en: [
        "Front-end development with modern frameworks",
        "Back-end API development and management",
        "Database design and optimization",
        "Third-party integrations",
        "Application deployment and DevOps",
        "Published and maintained apps on Google Play and App Store",
      ],
      fr: [
        "Développement front-end avec des frameworks modernes",
        "Développement et gestion d'API back-end",
        "Conception et optimisation de bases de données",
        "Intégrations tierces",
        "Déploiement applicatif et DevOps",
        "Publication et maintenance d'applications sur Google Play et App Store",
      ],
      ar: [
        "تطوير الواجهات الأمامية بأطر عمل حديثة",
        "تطوير وإدارة واجهات الخلفية البرمجية",
        "تصميم قواعد البيانات وتحسينها",
        "تكاملات مع الأطراف الثالثة",
        "نشر التطبيقات وعمليات DevOps",
        "نشر وصيانة تطبيقات على Google Play و App Store",
      ],
    },
    technologies: ["Flutter", "Node.js", "React", "MongoDB", "Firebase", "AWS"],
  },
] as const;

// ─── Education ─────────────────────────────────────────────────────────────

const education: readonly EducationEntry[] = [
  {
    id: 1,
    degree: {
      en: "Master's in Web and Knowledge Engineering",
      fr: "Master en ingénierie du web et des connaissances",
      ar: "ماجستير في هندسة الويب والمعرفة",
    },
    institution: {
      en: "The Higher School of Exact Science",
      fr: "École supérieure des sciences exactes",
      ar: "المدرسة العليا للعلوم الدقيقة",
    },
    university: {
      en: "University Djilali Lyabes",
      fr: "Université Djilali Liabès",
      ar: "جامعة جيلالي اليابس",
    },
    location: {
      en: "Sidi Bel Abbes, Algeria",
      fr: "Sidi Bel Abbès, Algérie",
      ar: "سيدي بلعباس، الجزائر",
    },
    completionDate: "2024",
    description: {
      en: "Advanced studies in web technologies, knowledge engineering, and data-driven systems with focus on AI/ML integration.",
      fr: "Études avancées en technologies du web, ingénierie des connaissances et systèmes pilotés par les données, axées sur l'intégration de l'IA et du ML.",
      ar: "دراسات متقدّمة في تقنيات الويب وهندسة المعرفة والأنظمة المعتمدة على البيانات مع التركيز على تكامل الذكاء الاصطناعي والتعلّم الآلي.",
    },
  },
  {
    id: 2,
    degree: {
      en: "Bachelor's in Software Engineering",
      fr: "Licence en génie logiciel",
      ar: "بكالوريوس في هندسة البرمجيات",
    },
    institution: {
      en: "The Higher School of Exact Science",
      fr: "École supérieure des sciences exactes",
      ar: "المدرسة العليا للعلوم الدقيقة",
    },
    university: {
      en: "University Djilali Lyabes",
      fr: "Université Djilali Liabès",
      ar: "جامعة جيلالي اليابس",
    },
    location: {
      en: "Sidi Bel Abbes, Algeria",
      fr: "Sidi Bel Abbès, Algérie",
      ar: "سيدي بلعباس، الجزائر",
    },
    completionDate: "2021",
    description: {
      en: "Comprehensive software engineering education covering algorithms, system design, and software development principles.",
      fr: "Formation complète en génie logiciel couvrant les algorithmes, la conception de systèmes et les principes du développement logiciel.",
      ar: "تعليم شامل في هندسة البرمجيات يغطّي الخوارزميات وتصميم الأنظمة ومبادئ تطوير البرمجيات.",
    },
  },
] as const;

// ─── Certifications ────────────────────────────────────────────────────────

const certifications: readonly Certification[] = [
  {
    title: {
      en: "Flutter & Dart Development",
      fr: "Développement Flutter & Dart",
      ar: "تطوير Flutter و Dart",
    },
    issuer: {
      en: "Professional Experience",
      fr: "Expérience professionnelle",
      ar: "خبرة احترافية",
    },
    date: "2025",
    description: {
      en: "5+ years of professional Flutter development with multiple published applications.",
      fr: "Plus de 5 ans de développement Flutter professionnel avec plusieurs applications publiées.",
      ar: "أكثر من خمس سنوات من تطوير Flutter الاحترافي مع عدّة تطبيقات منشورة.",
    },
  },
  {
    title: {
      en: "Full-Stack Web Development",
      fr: "Développement web full-stack",
      ar: "تطوير الويب المتكامل",
    },
    issuer: {
      en: "Professional Experience",
      fr: "Expérience professionnelle",
      ar: "خبرة احترافية",
    },
    date: "2024",
    description: {
      en: "Expertise in modern web technologies and architectures.",
      fr: "Expertise en technologies et architectures web modernes.",
      ar: "خبرة في تقنيات الويب الحديثة ومعماريّاتها.",
    },
  },
] as const;

// ─── Spoken languages ──────────────────────────────────────────────────────

const languages: readonly LanguageSkill[] = [
  {
    code: "ar",
    name: { en: "Arabic", fr: "Arabe", ar: "العربية" },
    level: "Native",
    percentage: 100,
  },
  {
    code: "en",
    name: { en: "English", fr: "Anglais", ar: "الإنجليزية" },
    level: "Professional",
    percentage: 85,
  },
  {
    code: "fr",
    name: { en: "French", fr: "Français", ar: "الفرنسية" },
    level: "Intermediate",
    percentage: 70,
  },
] as const;

// ─── Testimonials ──────────────────────────────────────────────────────────

const testimonials: readonly Testimonial[] = [
  {
    id: 1,
    author: "Project Client",
    position: {
      en: "Business Owner",
      fr: "Propriétaire d'entreprise",
      ar: "صاحب عمل",
    },
    company: "AwashZ",
    quote: {
      en: "Adel delivered an exceptional mobile application. His attention to detail, performance optimization, and commitment to quality were outstanding. Highly recommended.",
      fr: "Adel a livré une application mobile exceptionnelle. Son sens du détail, son optimisation des performances et son engagement envers la qualité ont été remarquables. Hautement recommandé.",
      ar: "قدّم عادل تطبيقًا مميّزًا. اهتمامه بالتفاصيل وتحسين الأداء والتزامه بالجودة كانت استثنائية. أنصح بالتعامل معه بقوّة.",
    },
    rating: 5,
  },
  {
    id: 2,
    author: "Team Member",
    position: {
      en: "Project Manager",
      fr: "Chef de projet",
      ar: "مدير مشروع",
    },
    company: "Lamlan Digital Solutions",
    quote: {
      en: "Working with Adel was a pleasure. His technical expertise, communication skills, and dedication to timely delivery exceeded expectations.",
      fr: "Travailler avec Adel a été un plaisir. Son expertise technique, ses compétences en communication et son engagement à livrer dans les délais ont dépassé les attentes.",
      ar: "كان العمل مع عادل تجربة ممتعة. خبرته التقنية ومهارات تواصله والتزامه بالتسليم في الوقت المحدّد تجاوزت التوقّعات.",
    },
    rating: 5,
  },
] as const;

// ─── Social links ──────────────────────────────────────────────────────────

const social: SocialLinks = {
  linkedin: "https://www.linkedin.com/in/adel-labdelli-merioua-1a4219209/",
  github: "https://github.com/ADEL-tec",
  portfolio: "https://adel-tec.github.io/portfolio/",
  email: "meriouaadel22@gmail.com",
  phone: "+974 6005 9654",
};

// ─── SEO metadata ──────────────────────────────────────────────────────────

const seo: SeoMetadata = {
  title: {
    en: "Adel Labdelli Merioua — Full-Stack Developer & Flutter Expert",
    fr: "Adel Labdelli Merioua — Développeur full-stack & expert Flutter",
    ar: "عادل لعبدلي ميروى — مطوّر متكامل وخبير Flutter",
  },
  description: {
    en: "Portfolio of Adel Labdelli Merioua — 5+ years of experience in mobile development, web design, and full-stack engineering. Flutter specialist with published apps.",
    fr: "Portfolio d'Adel Labdelli Merioua — plus de 5 ans d'expérience en développement mobile, design web et ingénierie full-stack. Spécialiste Flutter avec des applications publiées.",
    ar: "معرض أعمال عادل لعبدلي ميروى — أكثر من خمس سنوات خبرة في تطوير الموبايل وتصميم الويب والهندسة المتكاملة. متخصّص Flutter بتطبيقات منشورة.",
  },
  keywords: [
    "Flutter Developer",
    "Mobile App Development",
    "Full-Stack Developer",
    "Web Developer",
    "UI Designer",
    "Doha Qatar",
  ],
};

// ─── Exported aggregate ────────────────────────────────────────────────────

export const portfolioData = {
  personal,
  projects,
  skills,
  experience,
  education,
  certifications,
  languages,
  testimonials,
  social,
  seo,
} as const;

// ─── Convenience accessors (used by existing pages) ────────────────────────

/** All projects in display order. */
export function getProjects(): readonly Project[] {
  return [...portfolioData.projects].sort((a, b) => a.order - b.order);
}

/** Lookup a single project by `id`, or `undefined`. */
export function getProjectById(id: string): Project | undefined {
  return portfolioData.projects.find((p) => p.id === id);
}

/** Featured projects for the homepage strip. */
export function getFeaturedProjects(): readonly Project[] {
  return portfolioData.projects.filter((p) => p.featured);
}

/** All skills, optionally filtered by category. */
export function getSkills(category?: SkillCategory): readonly SkillGroup[] {
  return category
    ? portfolioData.skills.filter((g) => g.category === category)
    : portfolioData.skills;
}

/** Work experience in reverse chronological order (most recent first). */
export function getExperiences(): readonly ExperienceEntry[] {
  return [...portfolioData.experience].sort((a, b) => b.id - a.id);
}

/** Currently-held positions. */
export function getCurrentRoles(): readonly ExperienceEntry[] {
  return portfolioData.experience.filter((e) => e.current);
}

/** Re-export for convenience. */
export const personalInfo = personal;
