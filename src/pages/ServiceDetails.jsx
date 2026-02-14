import { useParams } from "react-router-dom";
import ServiceHeader from "../components/ServiceHeader";

const services = [
  {
    name: "Mobile app",
    icon: "/assets/mobile-icon.png",
    description:
      "I design and build high-performance mobile applications that are reliable, scalable, and tailored to real business needs. From idea to store release, I deliver smooth user experiences and clean architecture.",
    id: "0",
    keyPoints: [
      {
        title: "Cross-Platform Development",
        description:
          "Build once, deploy everywhere. I create apps that run seamlessly on both iOS and Android using modern cross-platform technologies.",
      },
      {
        title: "Clean & Scalable Architecture",
        description:
          "Apps are structured for long-term growth using proven patterns, making them easy to maintain, extend, and optimize.",
      },
      {
        title: "API & Backend Integration",
        description:
          "Secure integration with REST APIs, authentication systems, and cloud services to ensure smooth data flow and performance.",
      },
      {
        title: "Store Deployment & Support",
        description:
          "Complete support for App Store and Play Store submission, updates, and post-launch improvements.",
      },
    ],
  },
  {
    name: "Web design",
    icon: "/assets/web-icon.png",
    description:
      "I develop fast, modern, and responsive websites and web applications that convert visitors into users and support business growth.",
    id: "1",
    keyPoints: [
      {
        title: "Modern Frontend Development",
        description:
          "Clean, responsive interfaces built with modern frameworks for excellent performance and accessibility.",
      },
      {
        title: "Backend & Database Systems",
        description:
          "Robust server-side logic, secure authentication, and efficient database design to power your application.",
      },
      {
        title: "SEO & Performance Optimization",
        description:
          "Optimized loading speed, structure, and metadata to improve visibility and user engagement.",
      },
      {
        title: "Scalable Web Architecture",
        description:
          "Designed to handle growth — from small business websites to complex web platforms.",
      },
      {
        title: "Deployment & Maintenance",
        description:
          "Hosting setup, domain configuration, and continuous improvements after launch.",
      },
    ],
  },

  {
    name: "UI/ UX design",
    icon: "/assets/ui-icon.png",
    description:
      "I design intuitive and visually appealing user experiences that focus on clarity, usability, and user satisfaction.",
    id: "2",
    keyPoints: [
      {
        title: "User-Centered Design",
        description:
          "Every design decision is based on user behavior, needs, and real usage scenarios.",
      },
      {
        title: "Wireframes & Prototypes",
        description:
          "Clear wireframes and interactive prototypes to visualize the product before development starts.",
      },
      {
        title: "Modern Visual Design",
        description:
          "Clean layouts, balanced typography, and consistent color systems aligned with your brand.",
      },
      {
        title: "Design Systems & Consistency",
        description:
          "Reusable components and design rules for a consistent experience across all screens.",
      },
      {
        title: "Developer-Ready Designs",
        description:
          "Designs prepared with clear specs and assets to ensure smooth handoff to development.",
      },
    ],
  },
];

export default function ServiceDetails() {
  const { id } = useParams();
  const service = services.find((service) => service.id === id);
  return (
    <>
      <ServiceHeader {...service} />
      <div className="w-full px-[12%] py-10 scroll-mt-20">
        <h4 className="text-center mb-2 text-lg font-Ovo">Key points</h4>
        <h2 className="text-center text-5xl font-Ovo">What i offer</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-20">
          {service.keyPoints.map((point) => (
            <div
              key={point.title}
              className="border border-gray-300 dark:border-white/30 rounded-lg px-8 py-12 hover:shadow-black cursor-pointer hover:bg-lightHover hover:-translate-y-1 duration-500 dark:hover:bg-darkHover dark:hover:shadow-white"
            >
              <h3 className="text-lg font-semibold mb-4">{point.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {point.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
