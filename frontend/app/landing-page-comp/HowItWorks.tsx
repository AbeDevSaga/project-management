import React from 'react';
import { motion } from 'framer-motion';
import { FiUpload, FiUserCheck, FiCalendar, FiFileText, FiAward } from 'react-icons/fi';

const HowItWorks = () => {
  const steps = [
    {
      icon: <FiUpload className="w-6 h-6" />,
      title: "Project Submission",
      description: "Students submit project proposals through the platform",
      color: "text-blue-500"
    },
    {
      icon: <FiUserCheck className="w-6 h-6" />,
      title: "Advisor Approval",
      description: "Department assigns advisors who review and approve topics",
      color: "text-purple-500"
    },
    {
      icon: <FiCalendar className="w-6 h-6" />,
      title: "Milestone Tracking",
      description: "Students and advisors track progress against deadlines",
      color: "text-green-500"
    },
    {
      icon: <FiFileText className="w-6 h-6" />,
      title: "Document Submission",
      description: "Students upload drafts and final documents for review",
      color: "text-orange-500"
    },
    {
      icon: <FiAward className="w-6 h-6" />,
      title: "Evaluation & Grading",
      description: "Committee evaluates and grades completed projects",
      color: "text-indigo-500"
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="container mx-auto px-6 md:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            From Proposal to Final Defense
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A streamlined process that guides students through every project phase
          </p>
        </motion.div>

        {/* Timeline Steps */}
        <div className="relative">
          {/* Timeline line */}
          <div className="hidden md:block absolute left-1/2 top-0 h-full w-0.5 bg-gray-200 transform -translate-x-1/2"></div>
          
          <div className="space-y-12 md:space-y-0">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`relative flex flex-col md:flex-row items-center ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
              >
                {/* Step Content */}
                <div className={`md:w-1/2 p-6 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${step.color} bg-opacity-20 mb-4`}>
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">
                    {step.description}
                  </p>
                </div>

                {/* Step Number (Mobile) */}
                <div className="md:hidden flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
                  {index + 1}
                </div>

                {/* Step Number (Desktop) */}
                <div className="hidden md:flex flex-shrink-0 w-12 h-12 rounded-full bg-indigo-600 text-white items-center justify-center font-bold text-xl mx-6 relative z-10">
                  {index + 1}
                </div>

                {/* Empty div for alignment */}
                <div className="md:w-1/2"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;