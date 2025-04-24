"use client";
import React from "react";
import Image from "next/image";
import cli from "@/public/images/cli.jpg";
import { motion } from "framer-motion";
import { fadeIn, staggerContainer } from "../utils/motion";

const About = () => {
  return (
    <motion.section
      variants={staggerContainer(0.1, 0.2)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
      id="about"
      className="relative py-20 md:py-28 bg-white"
    >
      <div className="container mx-auto px-6 md:px-12">
        {/* Section Header */}
        <motion.div
          variants={fadeIn("up", "spring", 0.2, 1)}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
            Revolutionizing Academic Project Management
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            A comprehensive platform designed specifically for educational
            institutions to streamline final year projects from start to finish.
          </p>
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Image */}
          <motion.div
            variants={fadeIn("right", "spring", 0.4, 1)}
            className="relative h-80 md:h-96 lg:h-[500px] rounded-xl overflow-hidden shadow-lg"
          >
            <Image
              src={cli}
              alt="Students and advisors collaborating"
              fill
              className="object-cover"
              priority
            />
          </motion.div>

          {/* Right Column - Features */}
          <motion.div
            variants={fadeIn("left", "spring", 0.6, 1)}
            className="space-y-8"
          >
            <div className="flex items-start space-x-6">
              <div className="bg-indigo-100 p-3 rounded-full">
                <svg
                  className="w-6 h-6 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  End-to-End Project Lifecycle
                </h3>
                <p className="text-gray-600">
                  Manage everything from initial project proposals to final
                  submissions and evaluations in one centralized platform.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-6">
              <div className="bg-indigo-100 p-3 rounded-full">
                <svg
                  className="w-6 h-6 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Role-Based Collaboration
                </h3>
                <p className="text-gray-600">
                  Seamless interaction between students, advisors, department
                  heads, and administrators with tailored interfaces for each
                  role.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-6">
              <div className="bg-indigo-100 p-3 rounded-full">
                <svg
                  className="w-6 h-6 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Quality Assurance
                </h3>
                <p className="text-gray-600">
                  Built-in plagiarism checking, document version control, and
                  standardized evaluation rubrics ensure project quality.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default About;
