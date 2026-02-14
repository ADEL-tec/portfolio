import React from "react";
import { SiAppstore } from "react-icons/si";

export function AppStoreButton({ outline = false, className = "", link }) {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
        outline
          ? "border dark:border-white border-purple-800  dark:text-white text-purple-800 hover:bg-white/10"
          : "bg-white text-black hover:bg-gray-200"
      } transition font-medium ${className}`}
    >
      <SiAppstore />
      <span className="text-sm sm:text-base">App Store</span>
    </a>
  );
}
