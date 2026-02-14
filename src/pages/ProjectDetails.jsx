import { useParams } from "react-router-dom";
import WorkHeader from "../components/workHeader";
import WorkGallery from "../components/WorkGallery";
import WorkFeatures from "../components/WorkFeatures";
import { featuresData, gallery, techStack } from "../components/AwashZ";
import TechnologiesUsed from "../components/TechnologiesUsed";

function ProjectDetails() {
  const projects = [
    {
      name: "AwashZ",
      cover: "/assets/work-1.png",
      logo: "/assets/work-1-logo.png",
      gallery: gallery,
      description:
        "AWashZ is a location-based mobile application designed to simplify car care by allowing users to request professional car wash and auto services directly to their location. The platform focuses on convenience, efficiency, and seamless service booking while providing service providers with tools to manage requests and operations effectively.",
      id: "0",
      features: featuresData,
      technologies: techStack,
      APKUrl:
        "https://play.google.com/store/apps/details?id=com.fiveline.awaashz",
      IOSUrl: null,
    },
    {
      name: "Geo based app",
      cover: "/assets/work-2.png",
      logo: "/assets/work-2-logo.png",
      gallery: [
        "/assets/work-2-gal-1.png",
        "/assets/work-2-gal-2.png",
        "/assets/work-2-gal-3.png",
        "/assets/work-2-gal-4.png",
      ],
      description: "mobile app",
      id: "1",
      features: [
        "Real-time service booking and scheduling",
        "Location-based service delivery",
        "Service tracking and order management",
        "User and provider role management",
        "Admin dashboard for operational control",
        "Secure and scalable backend integration",
      ],
      technologies: techStack,
      APKUrl: "",
      IOSUrl: null,
    },
    {
      name: "Photography site",
      cover: "/assets/work-3.png",
      logo: "/assets/work-3-logo.png",
      gallery: [
        "/assets/work-3-gal-1.png",
        "/assets/work-3-gal-2.png",
        "/assets/work-3-gal-3.png",
        "/assets/work-3-gal-4.png",
      ],
      description: "Web Design",
      id: "2",
      features: [
        "Real-time service booking and scheduling",
        "Location-based service delivery",
        "Service tracking and order management",
        "User and provider role management",
        "Admin dashboard for operational control",
        "Secure and scalable backend integration",
      ],
      technologies: techStack,
      APKUrl: "",
      IOSUrl: null,
    },
    {
      name: "UI/UX designing",
      cover: "/assets/work-4.png",
      logo: "/assets/work-4-logo.png",
      gallery: [
        "/assets/work-4-gal-1.png",
        "/assets/work-4-gal-2.png",
        "/assets/work-4-gal-3.png",
        "/assets/work-4-gal-4.png",
      ],
      description: "UI/UX Design",
      id: "3",
      features: [
        "Real-time service booking and scheduling",
        "Location-based service delivery",
        "Service tracking and order management",
        "User and provider role management",
        "Admin dashboard for operational control",
        "Secure and scalable backend integration",
      ],
      technologies: techStack,
      APKUrl: "",
      IOSUrl: null,
    },
  ];
  const { id } = useParams();
  const project = projects.find((project) => project.id === id);

  return (
    <>
      <WorkHeader {...project} />
      <WorkGallery gallery={project.gallery} />
      <WorkFeatures features={project.features} />
      <TechnologiesUsed technologies={project.technologies} />
    </>
  );
}

export default ProjectDetails;
