# 🚀 Complete Portfolio Build - Claude Prompts
## Next.js + TypeScript + Framer Motion + shadcn/ui + Multi-Language + Dark Mode

**For:** Adel Labdelli Merioua - Full-Stack Developer Portfolio  
**Stack:** Next.js 14+ | TypeScript | Framer Motion | shadcn/ui | Tailwind CSS  
**Features:** English/French/Arabic | Dark/Light Theme | Smooth Animations

---

## 📋 How to Use These Prompts

**For Each Prompt:**
1. Copy the **ENTIRE** prompt text (everything between the dashes)
2. Go to **claude.ai**
3. Paste it in a new chat
4. Claude gives you the complete code
5. Copy the code and create the file shown at the top
6. Follow the next prompt

**Total Build Time:** 6-8 hours  
**Result:** Production-ready portfolio

---

## ✅ Prerequisites (Do First)

### Run these commands in your terminal:
```bash
# Create new Next.js project
npx create-next-app@latest portfolio --typescript --tailwind --eslint

cd portfolio

# Install required packages
npm install framer-motion next-intl @hookform/resolvers zustand lucide-react
npm install -D @types/node

# Install shadcn/ui
npx shadcn-ui@latest init

# Add shadcn components we'll use
npx shadcn-ui@latest add button card dropdown-menu sheet badge
```

**Note:** When prompted for shadcn setup, choose:
- Style: Default
- Base color: Slate
- CSS variables: Yes

---

---

## 🔧 PROMPT 1: Project Configuration & Setup Files

**Purpose:** Configure your project with all necessary settings  
**Creates:** `next.config.js`, `tailwind.config.ts`, TypeScript configs  
**Time:** 5 minutes

```
You are an expert Next.js developer. Create complete configuration files for a 
professional portfolio website with these requirements:

REQUIREMENTS:
- Next.js 14+ with App Router
- TypeScript
- Tailwind CSS with custom colors for a developer portfolio
- Dark mode support (light/dark theme toggle)
- Multi-language support (English, French, Arabic)
- Framer Motion for animations
- shadcn/ui components
- Responsive design (mobile first)

CREATE THESE FILES:

1. next.config.js
   - Configure next-intl for multi-language
   - Optimize images and fonts
   - Configure redirects for language routes

2. tailwind.config.ts
   - Custom color scheme for developer portfolio (blue, slate, emerald)
   - Dark mode configuration
   - Custom animations for Framer Motion
   - Extended spacing and typography

3. tsconfig.json
   - Strict mode enabled
   - Path aliases configured (@/, @/components, @/lib, etc.)
   - Proper type checking

4. .env.local template
   - ANTHROPIC_API_KEY for Claude integration
   - Any other env variables needed

Provide COMPLETE, production-ready code for each file.
Focus on best practices and scalability.
Include detailed comments explaining important sections.
```

---

## 🎨 PROMPT 2: Global Styles & Theme Configuration

**Purpose:** Set up theme system with light/dark mode  
**Creates:** `globals.css`, `theme.ts`, theme provider  
**Time:** 5 minutes

```
Create the global styling and theme configuration for a modern developer portfolio:

REQUIREMENTS:
- Tailwind CSS with custom color variables
- Light and dark theme support
- Smooth transitions between themes
- Global animations
- Custom scrollbar styling
- Professional gradient backgrounds

CREATE THESE FILES:

1. app/globals.css
   - CSS variables for light/dark themes
   - Color palette: Primary (blue), Secondary (emerald), Accent (slate)
   - Global animations for Framer Motion
   - Custom scrollbar styling
   - Smooth transitions (300ms)
   - Glass morphism effects
   - Gradient backgrounds

2. lib/theme.ts
   - Theme type definitions
   - Light theme colors
   - Dark theme colors
   - Helper functions for theme switching

3. Components/ThemeProvider.tsx (React component)
   - Next.js app router compatible
   - localStorage persistence
   - System preference detection
   - Smooth theme transitions without flashing

Provide complete, working code.
Use TypeScript interfaces for type safety.
Include detailed comments.
```

---

## 🌍 PROMPT 3: Multi-Language (i18n) Setup

**Purpose:** Configure English, French, Arabic language support  
**Creates:** Language config, translation files, i18n hook  
**Time:** 10 minutes

```
Create a complete multi-language setup for a developer portfolio with English, French, and Arabic:

REQUIREMENTS:
- Next.js with next-intl
- English (en) - default
- French (fr)
- Arabic (ar) - RTL support
- Language switcher component
- Persistent language preference
- Easy translation management

CREATE THESE FILES:

1. i18n.config.ts
   - Configuration for next-intl
   - Supported locales: ['en', 'fr', 'ar']
   - Default locale: 'en'
   - Request config

2. messages/en.json
   - Complete English translations for portfolio:
   - Navigation items (Home, About, Projects, Skills, Contact)
   - Hero section
   - Project descriptions (AwashZ, Glamix, Discount Plus)
   - Skills categories
   - Experience entries
   - Footer
   - Common buttons and labels

3. messages/fr.json
   - Complete French translations (accurate translations of English)
   - Same structure as English

4. messages/ar.json
   - Complete Arabic translations
   - Professional Arabic for developer portfolio
   - RTL-ready text

5. lib/useTranslations.ts hook
   - Custom hook to use translations in components
   - Type-safe translation keys
   - RTL class detection

Example translation structure:
{
  "nav": {
    "home": "...",
    "about": "...",
    "projects": "...",
    "skills": "...",
    "contact": "..."
  },
  "hero": {
    "title": "...",
    "subtitle": "...",
    "cta": "..."
  },
  ...
}

Provide COMPLETE translations for all sections.
Make French and Arabic natural and professional.
Include all text that will appear on the portfolio.
```

---

## 📁 PROMPT 4: Folder Structure & Type Definitions

**Purpose:** Organize project files and create TypeScript types  
**Creates:** Folder structure guide, types file  
**Time:** 5 minutes

```
Create the complete folder structure and TypeScript type definitions for the portfolio:

REQUIREMENTS:
- Next.js App Router structure
- Component organization
- Utility functions
- Type safety throughout
- Clean architecture

CREATE:

1. Detailed folder structure guide:
   app/
   ├── [lang]/
   │   ├── layout.tsx
   │   ├── page.tsx
   │   ├── about/page.tsx
   │   ├── projects/page.tsx
   │   ├── projects/[id]/page.tsx
   │   ├── contact/page.tsx
   │   └── api/
   │       ├── claude/chat.ts
   │       └── contact.ts
   │
   components/
   ├── layout/
   ├── sections/
   ├── ui/
   └── ...
   
   lib/
   ├── types.ts
   ├── data.ts
   ├── utils.ts
   ├── hooks.ts
   └── animations.ts

2. types/index.ts
   - Project interface with all properties
   - Skill interface
   - Experience interface
   - Education interface
   - Language interface
   - Testimonial interface
   - Contact form data interface

Example:
interface Project {
  id: number;
  title: string;
  titleFr: string;
  titleAr: string;
  description: string;
  descriptionFr: string;
  descriptionAr: string;
  // ... all other properties
}

Provide all interfaces needed for the portfolio.
Include proper TypeScript generics where needed.
Add detailed JSDoc comments.
```

---

## 💾 PROMPT 5: Portfolio Data File

**Purpose:** Create structured portfolio data matching your CV  
**Creates:** `lib/data.ts` with all portfolio information  
**Time:** 10 minutes

```
Create a comprehensive portfolio data file with all information for Adel's portfolio:

REQUIREMENTS:
- TypeScript with full type safety
- All data in ONE file for easy updates
- Includes: Personal info, projects, skills, experience, education
- All text in English, French, and Arabic
- Ready to export to components

CREATE: lib/data.ts

STRUCTURE:
const portfolioData = {
  personal: {
    name: "Adel Labdelli Merioua",
    title: "Full-Stack Developer & Flutter Expert",
    // ... with French and Arabic versions
  },
  projects: [
    {
      id: 1,
      title: "AwashZ - On-Demand Car Wash & Auto Services",
      titleFr: "AwashZ - Service de Lavage Auto à la Demande",
      titleAr: "أوشز - خدمة غسيل السيارات عند الطلب",
      description: "[Professional 250-word description]",
      descriptionFr: "[French version]",
      descriptionAr: "[Arabic version]",
      technologies: ["Flutter", "Dart", "Firebase", ...],
      features: [...],
      playStore: "https://play.google.com/store/apps/details?id=com.fiveline.awaashz",
      appStore: "",
      images: ["/images/projects/awashz-1.jpg", ...],
      highlights: ["Production Ready", "Published", ...]
    },
    // Glamix
    // Discount Plus
  ],
  skills: {
    mobile: { title: "Mobile Development", items: [...] },
    backend: { title: "Backend Development", items: [...] },
    frontend: { title: "Frontend Development", items: [...] },
    databases: { title: "Databases", items: [...] },
    cloud: { title: "Cloud & DevOps", items: [...] },
    // With French and Arabic titles
  },
  experience: [
    {
      position: "Flutter Developer",
      company: "Fiveline Website Solutions",
      // ... with descriptions in all languages
    },
    // ... other positions
  ],
  education: [...],
  certifications: [...],
  social: {
    linkedin: "...",
    github: "...",
    email: "...",
    phone: "..."
  }
}

IMPORTANT:
- Use the portfolio-data.json you already have as reference
- Translate ALL text to French and Arabic professionally
- Include ALL projects with full details
- Include ALL skills with proficiency levels
- Include complete work experience
- Make it easy to update later

Provide COMPLETE, ready-to-use TypeScript code.
Add proper types and interfaces.
Include JSDoc comments for complex sections.
```

---

## ⚙️ PROMPT 6: Utility Functions & Hooks

**Purpose:** Create reusable hooks and utility functions  
**Creates:** `lib/hooks.ts`, `lib/utils.ts`, animation helpers  
**Time:** 5 minutes

```
Create utility functions and custom hooks for the portfolio:

REQUIREMENTS:
- TypeScript hooks for language and theme
- Animation utilities for Framer Motion
- Utility functions for common tasks
- Type-safe and reusable

CREATE:

1. lib/hooks.ts
   Hooks:
   - useLanguage(): Get current language and change it
   - useTheme(): Get current theme and toggle it
   - useMounted(): Check if component is mounted (SSR safe)
   - useScrollPosition(): Get scroll position for header effects
   - useInView(): Detect when element enters viewport
   - useClaudeAPI(): Chat with Claude (optional)

2. lib/utils.ts
   Functions:
   - cn(): Combine classnames (Tailwind utility)
   - formatDate(): Format dates in all languages
   - getLocalizedText(): Get text in current language
   - scrollToSection(): Smooth scroll to sections
   - copyToClipboard(): Copy text with feedback
   - downloadResume(): Handle resume download

3. lib/animations.ts
   Framer Motion variants:
   - fadeIn: Simple fade in
   - slideIn: Slide from different directions
   - scaleIn: Scale animation
   - staggerContainer: Container for staggered children
   - containerVariants: For animating groups
   - textVariants: For animating text

ANIMATIONS EXAMPLE:
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8 } }
};

Provide all hooks with proper TypeScript types.
Include detailed comments.
Make them SSR-safe.
```

---

## 🎯 PROMPT 7: Layout Components (Header & Footer)

**Purpose:** Create reusable layout components  
**Creates:** Header with nav, Language switcher, Theme toggle, Footer  
**Time:** 15 minutes

```
Create header and footer layout components with navigation, language switcher, and theme toggle:

REQUIREMENTS:
- Next.js App Router with [lang] dynamic segments
- Responsive design (mobile hamburger menu)
- Dark/Light theme toggle
- Language switcher (EN/FR/AR with RTL)
- Smooth animations
- Sticky header on scroll
- shadcn/ui components
- Framer Motion animations
- TypeScript

CREATE:

1. components/layout/Header.tsx
   - Logo/Brand
   - Navigation links (Home, About, Projects, Skills, Contact)
   - Language switcher dropdown (EN, FR, AR)
   - Theme toggle button (sun/moon icons from lucide-react)
   - Mobile hamburger menu (uses shadcn Sheet component)
   - Sticky on scroll with blur background
   - Active link highlighting
   - Smooth transitions
   - RTL support for Arabic

2. components/layout/LanguageSwitcher.tsx
   - Dropdown showing current language
   - Show all 3 languages: English, Français, العربية
   - Link to current page in different language
   - Icon showing language code
   - Uses shadcn DropdownMenu

3. components/layout/ThemeToggle.tsx
   - Button to toggle light/dark
   - Shows sun icon in light mode
   - Shows moon icon in dark mode
   - Smooth transition
   - Uses lucide-react icons
   - Accessible

4. components/layout/MobileMenu.tsx
   - Hamburger menu for mobile (< 768px)
   - Uses shadcn Sheet component
   - All navigation items
   - Language switcher
   - Theme toggle
   - Closes after link click

5. components/layout/Footer.tsx
   - Company/personal info
   - Quick links
   - Social media links
   - Copyright
   - Responsive grid layout
   - Text in current language
   - Dark mode optimized

DESIGN REQUIREMENTS:
- Professional, clean design
- Smooth animations with Framer Motion
- Responsive and mobile-first
- Good contrast and readability
- Accessible (ARIA labels)
- RTL-ready for Arabic
- Uses Tailwind CSS with custom theme variables

Provide COMPLETE, production-ready React/TypeScript components.
Use shadcn/ui components where needed.
Include Framer Motion animations.
Add detailed comments.
Handle language switching properly.
```

---

## 🏠 PROMPT 8: Hero Section Component

**Purpose:** Create impressive hero section with animations  
**Creates:** Hero component with animated title, subtitle, CTA buttons  
**Time:** 10 minutes

```
Create an impressive hero section for a developer portfolio:

REQUIREMENTS:
- Eye-catching design for software developer
- Animated background gradient
- Typed/rotating titles (multiple titles rotating every 3 seconds)
- Smooth Framer Motion animations
- Multiple CTA buttons with hover effects
- Responsive design
- Dark/light mode support
- Multi-language support
- Professional yet modern look

CREATE: components/sections/Hero.tsx

COMPONENTS:
1. Avatar image (circular, with border)
2. Main title with smooth fade-in animation
3. Rotating subtitles (e.g., "Flutter Expert" → "Full-Stack Developer" → "Mobile App Specialist")
4. Professional bio text (2-3 lines)
5. CTA buttons:
   - Primary: "View My Work" (blue)
   - Secondary: "Get in Touch" (outline)
   - Optional: "Download Resume"
6. Animated scroll indicator at bottom
7. Background elements:
   - Gradient background that animates subtly
   - Blurred shapes in background (optional)
   - Particle effects (optional but nice)

ANIMATIONS REQUIRED:
- Fade in on load
- Rotate titles every 3 seconds with fade transition
- Button hover effects (scale, shadow)
- Scroll indicator bounces
- Parallax effect if user scrolls
- Staggered animation for elements

DESIGN:
- Professional color scheme (blue, slate, white)
- Good contrast
- Readable on all screen sizes
- Optimized for mobile (large tap targets)

Provide COMPLETE Hero.tsx component.
Use TypeScript with proper types.
Include Framer Motion animations.
Support all 3 languages.
Add detailed comments.
```

---

## 📱 PROMPT 9: Projects Section Component

**Purpose:** Display projects with filtering and detailed cards  
**Creates:** Projects section with grid, filters, project cards  
**Time:** 20 minutes

```
Create a professional projects section showcasing 3 portfolio projects:

REQUIREMENTS:
- Grid layout (1 col mobile, 2 cols tablet, 3 cols desktop)
- Project cards with images, description, tech stack, links
- Filter buttons (All, Mobile App, Web, etc.)
- Smooth animations on scroll/load
- Hover effects on cards
- Modal or detailed page for each project
- Links to live apps (Play Store, App Store, GitHub)
- Responsive design
- Dark mode support
- Multi-language

CREATE:

1. components/sections/Projects.tsx (Main container)
   - Filter buttons for project categories
   - Grid layout
   - Staggered animation for cards
   - Responsive grid
   - Loading state

2. components/ui/ProjectCard.tsx (Individual project card)
   - Project image with hover zoom
   - Project title and description
   - Technology badges
   - Highlights badges
   - Links to stores/GitHub
   - Hover effects:
     * Image zoom
     * Shadow increase
     * Slight scale
     * Link visibility

3. components/sections/ProjectModal.tsx or app/[lang]/projects/[id]/page.tsx
   - Detailed project view
   - Full description
   - Feature list
   - Architecture diagram (text description)
   - Gallery of images
   - Related projects
   - "Back" button
   - All in current language

DESIGN REQUIREMENTS:
- Each project has:
  * Eye-catching image
  * Title (with language support)
  * Short description
  * Full description (modal/page)
  * Technology stack (colored badges)
  * Features list
  * Highlights (badges)
  * Links to Play Store, App Store, GitHub
  * Status (Published, Active, etc.)

PROJECTS DATA:
1. AwashZ - On-Demand Car Wash & Auto Services
2. Glamix - Salon Booking & Appointment Management
3. Discount Plus - Digital Discounts & Membership Platform

ANIMATIONS:
- Cards fade in on scroll
- Staggered animation (each card after previous)
- Hover effects
- Image zoom on hover
- Smooth transitions (300ms)

Provide COMPLETE, production-ready components.
Use TypeScript.
Include Framer Motion animations.
Support all 3 languages.
Use shadcn/ui components where helpful.
Add detailed comments.
```

---

## 💼 PROMPT 10: Skills Section Component

**Purpose:** Display technical skills with proficiency levels  
**Creates:** Skills section with categories, levels, visualizations  
**Time:** 15 minutes

```
Create a professional skills section showcasing all technical expertise:

REQUIREMENTS:
- Organized by category (Mobile, Backend, Frontend, Database, Cloud, Architecture)
- Proficiency levels (Expert, Advanced, Intermediate)
- Visual progress bars or skill levels
- Smooth animations
- Responsive grid
- Dark/light mode
- Multi-language
- Interactive (hover effects)

CREATE:

1. components/sections/Skills.tsx (Main container)
   - Category tabs or separate sections
   - Responsive layout
   - Filter by category
   - Smooth transitions

2. components/ui/SkillCategory.tsx
   - Category title (with language support)
   - Description
   - List of skills in that category
   - Smooth reveal animation

3. components/ui/SkillItem.tsx
   - Skill name
   - Proficiency level (Expert/Advanced/Intermediate/Beginner)
   - Progress bar (0-100%)
   - Level color coding:
     * Expert: Blue (#3B82F6)
     * Advanced: Emerald (#10B981)
     * Intermediate: Orange (#F59E0B)
     * Beginner: Gray (#6B7280)
   - Icon (optional)
   - Hover effect: show tooltip with level

SKILL CATEGORIES & ITEMS:

Mobile Development (Expert - 95%)
- Flutter & Dart
- iOS & Android Development
- Cross-platform Architecture
- State Management (Provider, BLoC)
- Material Design & Cupertino

Backend Development (Advanced - 85%)
- Node.js
- Express.js
- NestJS
- RESTful API Design
- Database Design

Frontend Web (Advanced - 80%)
- JavaScript (ES6+)
- TypeScript
- React
- Responsive Design
- Performance Optimization

Databases (Advanced - 85%)
- Firebase
- MongoDB
- PostgreSQL
- MySQL
- Supabase

Cloud & DevOps (Advanced - 80%)
- Google Cloud Platform
- AWS
- Docker
- GitHub Actions
- CI/CD

Architecture (Advanced - 85%)
- Clean Architecture
- MVC Pattern
- BLoC Pattern
- Design Patterns
- SOLID Principles

ANIMATIONS:
- Fade in on scroll
- Progress bars animate from 0 to their value
- Staggered category reveals
- Smooth color transitions
- Hover effects on items

DESIGN:
- Clean, modern design
- Good use of whitespace
- Visual hierarchy
- Readable fonts
- Professional colors
- Dark mode optimized

Provide COMPLETE components.
Use TypeScript.
Include Framer Motion animations.
Support all 3 languages.
Add visual progress indicators.
Include detailed comments.
```

---

## 💼 PROMPT 11: Experience & Education Section

**Purpose:** Display work experience and education timeline  
**Creates:** Timeline component, experience cards, education section  
**Time:** 15 minutes

```
Create experience and education timeline sections:

REQUIREMENTS:
- Vertical timeline design
- Professional appearance
- Smooth animations
- Dark/light mode
- Multi-language support
- Responsive design
- Icons for companies/universities

CREATE:

1. components/sections/Experience.tsx
   - Title
   - Timeline layout (vertical, centered)
   - Experience items in chronological order (newest first)
   - Color-coded timeline dots
   - Smooth animations

2. components/ui/ExperienceCard.tsx
   - Job title
   - Company name
   - Duration (From - To / Present)
   - Location
   - Description (translated)
   - Responsibilities (bullet list)
   - Technologies used (badges)
   - Timeline connector
   - Alternate left/right on desktop (chevron style)
   - Company icon/logo (small)

3. components/sections/Education.tsx
   - Similar timeline structure
   - Degree name
   - Institution
   - Graduation date
   - Description/highlights
   - Location

EXPERIENCE DATA (from your CV):
1. Flutter Developer - Fiveline Website Solutions (June 2025 - Present)
2. Mobile Application Developer (Contract) - Lamlan Digital Solutions (Mar 2025 - June 2025)
3. Mobile Application Developer - SATL DOWAYA (Jul 2024 - Mar 2025)
4. Trainer (Flutter & Dart) - Private School (Sep 2022 - Mar 2025)
5. Freelance Full-Stack Developer (Sep 2019 - Sep 2022)

EDUCATION DATA:
1. Master's in Web and Knowledge Engineering (2024)
2. Bachelor's in Software Engineering (2021)

ANIMATIONS:
- Cards fade in as you scroll down
- Timeline dots expand on hover
- Staggered reveal
- Smooth color transitions
- Responsive: On mobile, items stack vertically without left/right alternation

DESIGN:
- Clean timeline with connector line
- Color-coded dots (blue for current, slate for past)
- Professional fonts
- Good spacing
- Dark mode optimized
- Fully responsive

Provide COMPLETE, production-ready components.
Use TypeScript.
Include Framer Motion animations.
Support all 3 languages.
Use shadcn/ui where helpful.
Add detailed comments.
```

---

## 📞 PROMPT 12: Contact Section & Form

**Purpose:** Create contact section with form and contact methods  
**Creates:** Contact section, form component, email integration  
**Time:** 15 minutes

```
Create a professional contact section with form and multiple contact methods:

REQUIREMENTS:
- Contact form with validation
- Multiple contact methods (email, phone, LinkedIn, GitHub)
- Form submission handling
- Success/error messages
- Dark/light mode support
- Multi-language support
- Smooth animations
- Accessible form
- Optional: Send email via API

CREATE:

1. components/sections/Contact.tsx (Main container)
   - Section title and description
   - Two column layout (form + contact methods on desktop)
   - Single column on mobile
   - Smooth animations

2. components/ui/ContactForm.tsx
   - Form fields:
     * Name (required)
     * Email (required, validated)
     * Phone (optional)
     * Subject (required)
     * Message (required, min 10 chars)
   - Form validation with clear error messages
   - Submit button (disabled while submitting)
   - Loading spinner during submission
   - Success message after submission
   - Reset form after success
   - Error handling with friendly messages
   - Uses React Hook Form for validation
   - Tooltip hints on focus
   - Smooth focus animations

3. components/ui/ContactMethods.tsx
   - Email: meriouaadel22@gmail.com
   - Phone: +974 6005 9654
   - LinkedIn: [Your profile]
   - GitHub: [Your profile]
   - Location: Doha, Qatar
   - Each with icon and hover effect
   - Copy to clipboard functionality
   - Open in appropriate app (tel:, mailto:, etc.)

4. app/[lang]/api/contact.ts (API route)
   - Validate form data
   - Send email to your address (optional, using Resend or Nodemailer)
   - Store in database (optional)
   - Return success/error response
   - Rate limiting (max 5 requests per hour from same IP)

DESIGN REQUIREMENTS:
- Clean, professional layout
- Good form spacing
- Clear call-to-action
- Visual feedback on all interactions
- Icons for contact methods
- Card-like design with subtle shadow
- Responsive and mobile-friendly
- Dark mode optimized
- Accessible (proper labels, ARIA)

ANIMATIONS:
- Section fade in on scroll
- Form fields fade in with stagger
- Button hover/click animations
- Success message animation
- Smooth transitions

FORM VALIDATION:
- Name: min 2 chars, max 50
- Email: valid email format
- Phone: optional, format validation if provided
- Subject: min 5 chars, max 100
- Message: min 10 chars, max 5000
- All fields required (except phone)

LANGUAGES:
- All labels, placeholders, error messages in EN/FR/AR
- Success message in current language
- Email subject in current language

Provide COMPLETE, production-ready components.
Use TypeScript.
Use React Hook Form for form handling.
Include validation with error messages.
Support all 3 languages.
Include Framer Motion animations.
Add detailed comments.
Make it accessible.
```

---

## 🤖 PROMPT 13: Claude Chat Integration (Optional but Recommended)

**Purpose:** Add AI-powered chat assistant to portfolio  
**Creates:** Chat component, API route, chat hook  
**Time:** 15 minutes

```
Create an AI-powered chat assistant for the portfolio using Claude API:

REQUIREMENTS:
- Floating chat widget
- Real-time responses from Claude
- Conversation history
- Type-safe TypeScript
- Multi-language support
- Dark/light mode
- Smooth animations
- Professional appearance

CREATE:

1. components/Chat.tsx (Main chat widget)
   - Floating button (bottom-right corner)
   - Opens modal/drawer on click
   - Conversation history displayed
   - Input field at bottom
   - Typing indicator while Claude responds
   - Copy button for responses
   - Close button
   - Smooth animations
   - Dark mode support

2. components/ChatMessage.tsx
   - User message (right-aligned, blue)
   - Assistant message (left-aligned, gray)
   - Timestamp
   - Markdown rendering (if Claude returns markdown)
   - Code syntax highlighting
   - Smooth fade in animation

3. app/[lang]/api/claude/chat.ts (API route)
   - POST endpoint
   - Accepts: message, conversation history
   - Calls Anthropic Claude API
   - Returns: assistant response
   - Error handling
   - Rate limiting

4. lib/hooks/useClaudeChat.ts
   - Custom hook for chat functionality
   - Manage messages state
   - Handle API calls
   - Loading state
   - Error handling
   - Clear history function

CHAT SYSTEM PROMPT (in Portuguese/Arabic/French context):
"You are Adel's portfolio assistant. Help visitors learn about projects, skills, 
and collaboration opportunities. Be friendly, professional, and knowledgeable about 
Flutter, full-stack development, and Adel's work. Reference specific projects when 
relevant. If asked about collaborations, suggest contacting via email: meriouaadel22@gmail.com"

DESIGN:
- Floating widget in bottom-right
- 400px wide on desktop, full width on mobile
- Rounded corners
- Subtle shadow
- Slides in from bottom-right
- Professional color scheme

ANIMATIONS:
- Smooth open/close
- Messages fade in
- Typing indicator animation
- Button hover effects
- Smooth transitions

FEATURES:
- Conversation history in session
- Option to download/save chat
- Clear history button
- Responsive design
- Mobile-friendly
- Accessible (ARIA labels)
- Multi-language responses (Claude responds in user's language)

Provide COMPLETE implementation.
Use TypeScript.
Include error handling.
Add Framer Motion animations.
Support all 3 languages.
Add detailed comments.
```

---

## 🎬 PROMPT 14: Page Layouts (About, Projects Detail, Contact)

**Purpose:** Create main page layouts  
**Creates:** page.tsx files for each section  
**Time:** 20 minutes

```
Create the main page layouts for the portfolio using Next.js App Router:

REQUIREMENTS:
- Next.js 14+ with [lang] dynamic segments
- TypeScript
- Metadata for each page (SEO)
- Import and compose components
- Smooth page transitions with Framer Motion
- Loading states
- Error handling

CREATE:

1. app/[lang]/layout.tsx (Root layout)
   - HTML lang attribute set to current language
   - ThemeProvider wrapper
   - Header component
   - Footer component
   - Chat component
   - Define metadata
   - Tailwind dark class support
   - RTL support for Arabic

2. app/[lang]/page.tsx (Home page)
   - Hero section
   - Projects overview
   - Skills teaser
   - Testimonials (2-3)
   - CTA section
   - Smooth page animations

3. app/[lang]/about/page.tsx (About page)
   - Personal story/intro
   - Experience timeline
   - Education section
   - Skills section
   - Technologies/tools
   - Interests and what I'm learning
   - CTA to projects

4. app/[lang]/projects/page.tsx (Projects listing)
   - Projects section with filters
   - Grid layout
   - Detailed descriptions
   - Links to project details

5. app/[lang]/projects/[id]/page.tsx (Project detail page)
   - Full project details
   - Gallery of images
   - Features list
   - Technology breakdown
   - Architecture description
   - Screenshots/demos
   - Links to app stores
   - Related projects
   - Comments/feedback section (optional)

6. app/[lang]/contact/page.tsx (Contact page)
   - Contact form
   - Contact methods
   - Location map (optional)
   - FAQ section (optional)

IMPORTANT:
- Each page must handle [lang] dynamic segment
- Redirect invalid languages to default (en)
- All text from lib/data.ts
- Proper metadata for SEO
- Loading states
- Error boundaries
- Type-safe data fetching

METADATA EXAMPLE:
export const generateMetadata = ({ params }: Props) => ({
  title: `Adel Labdelli Merioua - Full-Stack Developer${params.lang !== 'en' ? ` (${params.lang.toUpperCase()})` : ''}`,
  description: "Portfolio showcasing Flutter expertise and full-stack development projects...",
  openGraph: { ... }
})

Provide all page files.
Use TypeScript with proper types.
Include metadata for each page.
Handle language routing properly.
Use Framer Motion for animations.
Add loading states.
Include error handling.
```

---

## 🎨 PROMPT 15: Advanced Animations & Micro-interactions

**Purpose:** Polish with smooth animations and interactions  
**Creates:** Animation utilities, interactive elements, page transitions  
**Time:** 15 minutes

```
Create advanced animations and micro-interactions for the portfolio:

REQUIREMENTS:
- Smooth page transitions
- Staggered animations
- Scroll-triggered animations
- Hover effects
- Loading animations
- Typing animations
- Particle effects (optional)
- Smooth scrolling

CREATE:

1. lib/animations.ts (Enhanced animation variants)
   - fadeIn, fadeOut
   - slideIn (from different directions)
   - scaleIn, scaleOut
   - rotateIn
   - staggerContainer (for child animations)
   - textVariants (for individual letters)
   - Custom easing functions
   - Duration variables
   - Responsive animation adjustments

2. components/animations/ScrollReveal.tsx
   - Wrapper component for scroll-triggered animations
   - Detects when element enters viewport
   - Triggers animation automatically
   - Works with Intersection Observer API
   - Configurable animation type and delay

3. components/animations/TypingText.tsx
   - Animated typing effect for hero title
   - Character-by-character reveal
   - Configurable speed
   - Auto-repeat with pause
   - Smooth and natural effect

4. components/animations/ParticleBackground.tsx (Optional but nice)
   - Animated particles in background
   - Performance optimized
   - Different density on mobile/desktop
   - Subtle, not distracting
   - Interactive (moves with mouse, optional)

5. components/animations/PageTransition.tsx
   - Smooth transitions between pages
   - Fade in/out effect
   - Slide transition (optional)
   - Loading state with progress bar

MICRO-INTERACTIONS:
- Button hover: scale(1.05) + shadow
- Link hover: color change + underline animate
- Input focus: border color + glow
- Card hover: scale + shadow increase
- Icon hover: rotate + scale
- Smooth scrolling: scroll-behavior: smooth

ANIMATIONS TO INCLUDE:
- Hero title: Fade in + slide down
- Hero subtitle: Rotate with fade in
- Project cards: Fade in on scroll + stagger
- Skill items: Progress bar animate from 0
- Timeline: Dots scale on hover
- Buttons: Ripple effect on click
- Images: Zoom on hover
- Text: Letter spacing animation on hover

PERFORMANCE:
- Use will-change sparingly
- GPU acceleration for smooth animations
- Reduce animations on mobile
- Check prefers-reduced-motion
- Optimize animations with requestAnimationFrame

ACCESSIBILITY:
- Respect prefers-reduced-motion
- Animate only non-essential elements
- Keep animations under 1000ms
- Don't use flashing (> 3 flashes per second)

Provide all animation utilities and components.
Use Framer Motion best practices.
Optimize for performance.
Include accessibility checks.
Add detailed comments.
Provide examples of usage.
```

---

## 🔍 PROMPT 16: SEO & Metadata Optimization

**Purpose:** Ensure good search engine visibility  
**Creates:** SEO configuration, metadata, sitemap, robots.txt  
**Time:** 10 minutes

```
Create complete SEO optimization for the portfolio:

REQUIREMENTS:
- Next.js metadata API
- Open Graph tags
- Structured data (JSON-LD)
- Sitemap
- Robots.txt
- Meta descriptions
- Keywords
- Social media preview optimization

CREATE:

1. app/[lang]/layout.tsx (Enhanced with metadata)
   - Proper title and description
   - Open Graph tags
   - Twitter Card tags
   - Favicon and app icons

2. next-sitemap.js or sitemap route
   - Generate sitemap.xml
   - Include all pages (en, fr, ar versions)
   - Update frequency
   - Priority for each page

3. public/robots.txt
   - Allow search engines
   - Disallow sensitive paths
   - Link to sitemap

4. lib/seo.ts
   - SEO configuration object
   - Helper functions for metadata
   - Structured data generators
   - Social media preview helpers

5. Metadata for each page:
   - Home: Comprehensive description of all services
   - About: Personal branding keywords
   - Projects: Technical keywords, project names
   - Skills: Technical skill keywords
   - Contact: Contact and availability info

SEO KEYWORDS TO INCLUDE:
- Flutter Developer
- Mobile App Development
- Full-Stack Developer
- React Developer
- Node.js Developer
- Web Developer
- Doha, Qatar
- Software Developer
- App Developer
- Open Source Contributor
- [Any other relevant keywords]

STRUCTURED DATA:
- Person schema for Adel
- Organization schema
- Project schemas (for each app)
- EducationalOccupationalCredential schema
- BreadcrumbList for navigation
- LocalBusiness (for location)

SOCIAL PREVIEW:
- Open Graph image (1200x630px)
- Twitter summary card
- LinkedIn preview optimization
- Clear, compelling descriptions

Provide complete SEO setup.
Use Next.js metadata API.
Include JSON-LD schema markup.
Add sitemap generation.
Optimize for search engines.
Add detailed comments.
```

---

## 📦 PROMPT 17: Build & Deployment Configuration

**Purpose:** Prepare for production deployment  
**Creates:** Environment variables, vercel.json, build scripts  
**Time:** 10 minutes

```
Create production-ready build and deployment configuration:

REQUIREMENTS:
- Environment variables template
- Vercel deployment config
- Performance optimization
- Security headers
- Build scripts
- Error tracking setup (optional)

CREATE:

1. .env.local (template)
   ANTHROPIC_API_KEY=your_key_here
   NEXT_PUBLIC_SITE_URL=https://your-domain.com
   NEXT_PUBLIC_GA_ID=your_ga_id (optional)

2. .env.example
   - Public version without secrets
   - For documentation
   - Shows all required variables

3. vercel.json
   - Build configuration
   - Environment variables setup
   - Cron jobs (optional)
   - Redirects
   - Headers for security

4. next.config.js (Enhanced)
   - Image optimization
   - Font optimization
   - Bundle analysis (optional)
   - Security headers
   - Caching strategies

5. package.json (Scripts section)
   - build script
   - dev script
   - lint script
   - type-check script
   - format script
   - deploy script

DEPLOYMENT CHECKLIST:
- [ ] All environment variables set
- [ ] Images optimized
- [ ] All links working
- [ ] Mobile responsive tested
- [ ] Dark mode working
- [ ] All languages working
- [ ] Forms submission working
- [ ] Analytics enabled
- [ ] SEO optimized
- [ ] Performance tested
- [ ] Security headers added
- [ ] HTTPS enabled
- [ ] CDN configured

SECURITY HEADERS:
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin
- Content-Security-Policy: [proper configuration]

PERFORMANCE OPTIMIZATION:
- Enable compression
- Optimize images
- Cache strategies
- Minify CSS/JS
- Remove unused code
- Lazy load components
- Optimize fonts

Provide complete deployment setup.
Include environment configuration.
Add security headers.
Optimize for performance.
Include deployment checklist.
Add detailed comments.
```

---

## 🧪 PROMPT 18: Testing & Quality Assurance

**Purpose:** Ensure code quality and functionality  
**Creates:** Test files, testing utilities, QA checklist  
**Time:** 15 minutes

```
Create testing setup and QA procedures for the portfolio:

REQUIREMENTS:
- Unit tests for components
- Integration tests
- E2E testing setup
- Testing utilities
- QA checklist
- Performance testing
- Accessibility testing

CREATE:

1. jest.config.js
   - Jest configuration
   - Next.js support
   - TypeScript support
   - Path aliases
   - Coverage settings

2. __tests__/components/Hero.test.tsx
   - Test Hero component rendering
   - Test prop variations
   - Test animation triggers
   - Test responsive behavior

3. __tests__/components/ProjectCard.test.tsx
   - Test project data display
   - Test click handlers
   - Test image loading
   - Test link functionality

4. __tests__/hooks/useLanguage.test.ts
   - Test language switching
   - Test persistence
   - Test translations
   - Test RTL detection

5. __tests__/utils/utils.test.ts
   - Test utility functions
   - Test data formatting
   - Test string helpers
   - Test calculations

6. cypress/e2e/navigation.cy.ts (Optional but recommended)
   - Test page navigation
   - Test language switching
   - Test theme toggle
   - Test responsive behavior

QA CHECKLIST:
Cross-browser Testing:
- [ ] Chrome/Chromium
- [ ] Firefox
- [ ] Safari
- [ ] Edge

Mobile Testing:
- [ ] iPhone SE / small phones
- [ ] iPhone 12/13 / medium phones
- [ ] iPad / tablets
- [ ] Android phones
- [ ] Tablet view

Functionality Testing:
- [ ] All links working
- [ ] Forms submit correctly
- [ ] Language switching works
- [ ] Theme toggle works
- [ ] Chat opens/closes
- [ ] Mobile menu works
- [ ] All pages load
- [ ] Images load
- [ ] Videos play (if any)

Performance Testing:
- [ ] Lighthouse score > 90
- [ ] Page load time < 3s
- [ ] Mobile performance tested
- [ ] Images optimized
- [ ] No console errors

Accessibility Testing:
- [ ] ARIA labels present
- [ ] Keyboard navigation works
- [ ] Color contrast sufficient
- [ ] Focus indicators visible
- [ ] Screen reader compatible
- [ ] Text resizable

SEO Testing:
- [ ] Meta tags present
- [ ] Open Graph tags correct
- [ ] Sitemap accessible
- [ ] Robots.txt correct
- [ ] Structured data valid
- [ ] Mobile-friendly

Security Testing:
- [ ] No sensitive data in code
- [ ] Environment variables secure
- [ ] API endpoints protected
- [ ] HTTPS enabled
- [ ] Security headers present

Provide complete testing setup.
Include test examples.
Add QA checklist.
Include accessibility guidelines.
Recommend testing tools.
Add detailed comments.
```

---

## 📋 PROMPT 19: Documentation & README

**Purpose:** Create comprehensive project documentation  
**Creates:** README.md, SETUP.md, CONTRIBUTING.md  
**Time:** 10 minutes

```
Create comprehensive project documentation:

REQUIREMENTS:
- Clear setup instructions
- Project overview
- Feature list
- Technology stack
- Development guide
- Deployment instructions
- Troubleshooting
- Contributing guidelines

CREATE:

1. README.md
   - Project title and description
   - Live link
   - Features list
   - Technology stack
   - Quick start
   - File structure overview
   - Contributing guidelines
   - License
   - Contact info

2. SETUP.md
   - Prerequisites (Node.js version, npm/yarn)
   - Step-by-step setup instructions
   - Environment variable setup
   - Running development server
   - Building for production
   - Common issues and solutions
   - Deployment options

3. CONTRIBUTING.md
   - How to contribute
   - Code style guidelines
   - Commit message format
   - Pull request process
   - Reporting bugs
   - Suggesting features

4. docs/ARCHITECTURE.md (Optional)
   - Project structure explanation
   - Component organization
   - Data flow
   - API routes
   - Styling approach
   - Animation system
   - Language/theme system

5. docs/DEPLOYMENT.md
   - Deployment options (Vercel, Netlify, etc.)
   - Step-by-step deployment
   - Environment variables for production
   - Domain setup
   - SSL/HTTPS
   - CDN configuration
   - Monitoring and analytics

FILE STRUCTURE FOR README:
# Portfolio of Adel Labdelli Merioua

## Description
Professional portfolio showcasing Flutter expertise and full-stack development...

## Features
- ✨ Smooth animations with Framer Motion
- 🌙 Dark/Light theme toggle
- 🌍 Multi-language support (EN/FR/AR)
- 📱 Fully responsive design
- ♿ Accessibility features
- 🚀 Performance optimized
- 🤖 AI-powered chat assistant
- 📊 Project portfolio showcase

## Tech Stack
- Next.js 14
- TypeScript
- Tailwind CSS
- Framer Motion
- shadcn/ui
- next-intl

## Quick Start
```bash
npm install
npm run dev
```

## Contributing
Contributions welcome! See CONTRIBUTING.md

## Contact
- Email: meriouaadel22@gmail.com
- LinkedIn: [Your LinkedIn]
- GitHub: [Your GitHub]

Provide all documentation files.
Write clear, beginner-friendly instructions.
Include code examples where helpful.
Add troubleshooting sections.
Include multiple deployment options.
Make it easy to contribute.
```

---

## 📝 FINAL SUMMARY & EXECUTION ORDER

### **Complete Portfolio Build - 18 Prompts**

| # | Prompt | Time | Output |
|---|--------|------|--------|
| 1 | Project Config | 5 min | next.config.js, tailwind.config.ts |
| 2 | Styles & Theme | 5 min | globals.css, ThemeProvider |
| 3 | i18n Setup | 10 min | Translations (EN/FR/AR) |
| 4 | Types & Structure | 5 min | TypeScript interfaces |
| 5 | Portfolio Data | 10 min | lib/data.ts |
| 6 | Hooks & Utils | 5 min | Custom hooks & utilities |
| 7 | Layout Components | 15 min | Header, Footer, Switchers |
| 8 | Hero Section | 10 min | Hero.tsx with animations |
| 9 | Projects Section | 20 min | Projects grid & cards |
| 10 | Skills Section | 15 min | Skills showcase |
| 11 | Experience Section | 15 min | Timeline components |
| 12 | Contact Section | 15 min | Form & contact methods |
| 13 | Chat Integration | 15 min | Claude AI chat widget |
| 14 | Page Layouts | 20 min | All page.tsx files |
| 15 | Advanced Animations | 15 min | Animation utilities |
| 16 | SEO & Metadata | 10 min | SEO configuration |
| 17 | Deployment Config | 10 min | Vercel & build setup |
| 18 | Testing & QA | 15 min | Tests & checklist |
| 19 | Documentation | 10 min | README & guides |

**Total Time:** 7-10 hours  
**Result:** Production-ready portfolio

---

## 🚀 START HERE - QUICK COMMANDS

```bash
# 1. Create project
npx create-next-app@latest portfolio --typescript --tailwind

cd portfolio

# 2. Install dependencies
npm install framer-motion next-intl @hookform/resolvers zustand lucide-react
npm install -D @types/node

# 3. Setup shadcn/ui
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card dropdown-menu sheet badge

# 4. Start building with Prompt 1
```

---

## 📌 IMPLEMENTATION TIPS

1. **Do ONE prompt at a time** - Don't try to do multiple prompts in one chat
2. **Create files immediately** - Don't wait to create files, do it right after getting code
3. **Test as you go** - Run `npm run dev` and check each component
4. **Use TypeScript** - Proper types prevent bugs
5. **Commit frequently** - Use Git to track progress
6. **Test on mobile** - Make sure responsive design works
7. **Test all languages** - Switch between EN/FR/AR
8. **Test dark mode** - Toggle light/dark theme
9. **Get feedback** - Show it to friends and get honest feedback
10. **Deploy early** - Deploy to Vercel after first few prompts

---

## ✨ You Now Have Everything!

These 19 prompts will build a complete, professional portfolio from scratch.

**Start with Prompt 1** → Follow the order → Deploy with Prompt 17

**Questions?** Each prompt has detailed instructions and examples.

**Ready?** Go to claude.ai and paste Prompt 1 now! 🚀
