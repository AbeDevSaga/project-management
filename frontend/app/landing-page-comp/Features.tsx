import React from 'react';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiMessageSquare, FiFileText, FiUsers, FiBarChart2, FiClock } from 'react-icons/fi';

const Features = () => {
  const features = [
    {
      icon: <FiFileText className="w-6 h-6" />,
      title: "Project Submission",
      description: "Streamlined process for students to submit project proposals and documents with version control."
    },
    {
      icon: <FiCheckCircle className="w-6 h-6" />,
      title: "Progress Tracking",
      description: "Real-time monitoring of project milestones with visual progress indicators for students and advisors."
    },
    {
      icon: <FiMessageSquare className="w-6 h-6" />,
      title: "Integrated Messaging",
      description: "Built-in chat system for seamless communication between students, advisors, and administrators."
    },
    {
      icon: <FiUsers className="w-6 h-6" />,
      title: "Role-Based Access",
      description: "Custom dashboards for students, advisors, department heads, and administrators."
    },
    {
      icon: <FiBarChart2 className="w-6 h-6" />,
      title: "Analytics Dashboard",
      description: "Comprehensive reporting tools to track project statuses across departments."
    },
    {
      icon: <FiClock className="w-6 h-6" />,
      title: "Deadline Management",
      description: "Automated reminders and notifications for upcoming deadlines and evaluations."
    }
  ];

  return (
    <section id="features" className="py-20 bg-gray-50">
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
            Powerful Features for Academic Projects
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to manage final year projects from start to finish
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="text-indigo-600 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;