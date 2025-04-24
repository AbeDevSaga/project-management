import React from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiBook, FiClipboard, FiSettings } from 'react-icons/fi';

const RoleBased = () => {
  const roles = [
    {
      icon: <FiUser className="w-6 h-6" />,
      title: "Students",
      description: "Submit proposals, track progress, and communicate with advisors",
      features: [
        "Project submission portal",
        "Milestone tracking",
        "Document version control",
        "Advisor messaging"
      ],
      color: "bg-blue-100 text-blue-600"
    },
    {
      icon: <FiBook className="w-6 h-6" />,
      title: "Advisors",
      description: "Guide students and evaluate project progress",
      features: [
        "Project approval workflow",
        "Progress monitoring",
        "Feedback tools",
        "Evaluation rubrics"
      ],
      color: "bg-purple-100 text-purple-600"
    },
    {
      icon: <FiClipboard className="w-6 h-6" />,
      title: "Department Heads",
      description: "Oversee all projects and generate reports",
      features: [
        "Department-wide dashboard",
        "Analytics & reporting",
        "Resource allocation",
        "Quality control"
      ],
      color: "bg-green-100 text-green-600"
    },
    {
      icon: <FiSettings className="w-6 h-6" />,
      title: "Administrators",
      description: "Configure system settings and manage users",
      features: [
        "User management",
        "System configuration",
        "Notification settings",
        "Troubleshooting"
      ],
      color: "bg-orange-100 text-orange-600"
    }
  ];

  return (
    <section id="roles" className="py-20 bg-gray-50">
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
            Designed for Every User Role
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Custom interfaces tailored to each stakeholder's needs
          </p>
        </motion.div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {roles.map((role, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
            >
              {/* Role Header */}
              <div className={`p-6 ${role.color} flex items-center space-x-3`}>
                <div className="p-2 rounded-lg bg-white bg-opacity-30">
                  {role.icon}
                </div>
                <h3 className="text-xl font-semibold">{role.title}</h3>
              </div>

              {/* Role Content */}
              <div className="p-6">
                <p className="text-gray-600 mb-4">{role.description}</p>
                <ul className="space-y-2">
                  {role.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RoleBased;