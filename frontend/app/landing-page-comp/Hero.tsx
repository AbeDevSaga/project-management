"use client";
import React from "react";
import Image from "next/image";
import pms from "@/public/images/pms.webp";
import { useRouter } from "next/navigation";

const Hero = () => {
  const router = useRouter();

  return (
    <section className="relative h-screen flex items-center bg-gradient-to-br from-blue-50 to-indigo-100 pt-16">
      <div className="container mx-auto px-6 md:px-12 flex flex-col-reverse md:flex-row items-center justify-between">
        {/* Text Content */}
        <div className="md:w-1/2 mt-10 md:mt-0">
          <div className="flex flex-col text-5xl">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-800 leading-tight">
              Haramaya Univerisity
            </h1>
            undergraduate student
            <span className="text-indigo-600 text-6xl">project monitoring</span>
          </div>
          <p className="mt-4 text-lg md:text-xl text-gray-600">
            From title submission to final defense manage, track, and
            collaborate effortlessly.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            {/* <button 
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors text-lg font-medium"
              onClick={() => router.push("/demo")}
            >
              Request Demo
            </button>
            <button 
              className="border-2 border-indigo-600 text-indigo-600 px-6 py-3 rounded-lg hover:bg-indigo-50 transition-colors text-lg font-medium"
              onClick={() => router.push("#features")}
            >
              Learn More
            </button> */}
          </div>
        </div>

        {/* Image/Illustration */}
        <div className="md:w-1/2 flex justify-center">
          <div className="relative w-full max-w-md lg:max-w-lg aspect-square">
            <Image
              src={pms}
              alt="Project Management Dashboard"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer">
        <svg
          className="w-8 h-8 text-indigo-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
