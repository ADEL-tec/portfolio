import {
  MapPin,
  CalendarCheck,
  CreditCard,
  Truck,
  ShieldCheck,
  BarChart3,
} from "lucide-react";
import { SiFlutter, SiFirebase, SiDart, SiFigma } from "react-icons/si";

export const techStack = [
  { name: "Flutter", icon: <SiFlutter size={28} /> },
  { name: "Dart", icon: <SiDart size={28} /> },
  { name: "Firebase Auth", icon: <SiFirebase size={28} /> },
  { name: "Figma", icon: <SiFigma size={28} /> },
];

export const featuresData = [
  {
    icon: <MapPin className="text-purple-500 size-8 mt-4" />,
    title: "Location-Based Booking",
    description:
      "Users can request car wash services directly to their location with accurate geo-detection and address management.",
  },
  {
    icon: <CalendarCheck className="text-purple-500 size-8 mt-4" />,
    title: "Real-Time Scheduling",
    description:
      "Flexible booking system allowing customers to schedule immediate or future service appointments.",
  },
  {
    icon: <Truck className="text-purple-500 size-8 mt-4" />,
    title: "On-Demand Service Dispatch",
    description:
      "Service providers receive instant booking notifications and manage job assignments efficiently.",
  },
  {
    icon: <CreditCard className="text-purple-500 size-8 mt-4" />,
    title: "Secure Payment Integration",
    description:
      "Integrated payment workflow supporting secure digital transactions and order confirmation.",
  },
  {
    icon: <ShieldCheck className="text-purple-500 size-8 mt-4" />,
    title: "Role-Based Access Control",
    description:
      "Separate workflows for customers, service providers, and administrators with secure authentication.",
  },
  {
    icon: <BarChart3 className="text-purple-500 size-8 mt-4" />,
    title: "Admin Dashboard & Analytics",
    description:
      "Comprehensive management panel to monitor bookings, track performance, and manage users.",
  },
];

export const gallery = [
  "assets/work-1-gal-1.jpg",
  "assets/work-1-gal-2.png",
  "assets/work-1-gal-3.png",
  "assets/work-1-gal-4.png",
];
