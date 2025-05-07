"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 py-4 px-6 md:px-12 flex justify-between items-center bg-white/80 backdrop-blur-sm shadow-sm z-50">
      <div
        className="text-2xl font-bold text-indigo-600 cursor-pointer"
        onClick={() => {
          router.push("/");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      >
        EduProjectFlow
      </div>

      <div className="hidden md:flex space-x-8">
        <button
          onClick={() => scrollToSection("features")}
          className="text-gray-600 hover:text-indigo-600 transition-colors"
        >
          Features
        </button>
        <button
          onClick={() => scrollToSection("how-it-works")}
          className="text-gray-600 hover:text-indigo-600 transition-colors"
        >
          How It Works
        </button>
        <button
          onClick={() => scrollToSection("testimonials")}
          className="text-gray-600 hover:text-indigo-600 transition-colors"
        >
          Testimonials
        </button>
      </div>

      <div className="flex space-x-4">
        <button
          onClick={() => router.push("/auth/login")}
          className="px-4 py-2 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-colors border border-indigo-600 font-medium"
        >
          Login
        </button>
        {/* <button
          onClick={() => router.push("/auth/register")}
          className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors font-medium"
        >
          Sign Up
        </button> */}
      </div>
    </nav>
  );
};

export default Navbar;