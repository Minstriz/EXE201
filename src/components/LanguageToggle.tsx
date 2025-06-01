"use client";
import { useState } from "react";
import { FaGlobe } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";

export default function LanguageToggle() {
  const [open, setOpen] = useState(false);
  const [language, setLanguage] = useState("Tiếng Việt");

  const handleSelect = (lang: string) => {
    setLanguage(lang);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="border px-3 py-1 rounded flex items-center space-x-2 text-sm hover:bg-[#1b89a1] transition"
      >
        <FaGlobe />
        <span>{language}</span>
        <IoIosArrowDown
          className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="absolute bottom-full mb-2 w-full bg-white text-black rounded-md shadow z-10">
          {language !== "Tiếng Việt" && (
            <button
              onClick={() => handleSelect("Tiếng Việt")}
              className="block w-full text-left px-4 py-2 rounded-md hover:bg-[#e0f4f7] transition"
            >
              Tiếng Việt
            </button>
          )}
          {language !== "English" && (
            <button
              onClick={() => handleSelect("English")}
              className="block w-full text-left px-4 py-2 rounded-md hover:bg-[#e0f4f7] transition"
            >
              English
            </button>
          )}
        </div>
      )}
    </div>
  );
}
