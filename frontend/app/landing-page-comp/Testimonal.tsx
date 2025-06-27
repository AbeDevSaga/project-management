import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiMessageSquare } from 'react-icons/fi';
import Image from 'next/image';

const Testimonial = () => {
  const testimonials = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      role: "Computer Science Department Head",
      avatar: "/images/logo.png",
      content: "This system reduced our project management workload by 60%. The automated reminders and progress tracking have been game-changers for our department.",
      rating: 5
    },
    {
      id: 2,
      name: "Prof. Michael Chen",
      role: "Engineering Faculty Advisor",
      avatar: "/images/avatar-2.jpg",
      content: "The document version control alone has saved me countless hours. I can now focus on guiding students rather than managing paperwork.",
      rating: 4
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "Final Year Student",
      avatar: "/images/avatar-3.jpg",
      content: "As a student, I love how everything is in one place. My advisor's feedback comes faster, and I always know what to do next.",
      rating: 5
    }
  ];

  const [current, setCurrent] = useState(0);

  const nextTestimonial = () => {
    setCurrent((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const prevTestimonial = () => {
    setCurrent((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  return (
    <section id="testimonials" className="py-20 bg-indigo-50">
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
            Trusted by Educators & Students
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Hear from those who've transformed their project management
          </p>
        </motion.div>

        {/* Testimonial Carousel */}
        <div className="relative max-w-4xl mx-auto">
          {/* Navigation Arrows */}
          <button 
            onClick={prevTestimonial}
            className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 md:-ml-8 z-10 bg-white p-2 rounded-full shadow-md hover:bg-indigo-100 transition-colors"
            aria-label="Previous testimonial"
          >
            <FiChevronLeft className="w-6 h-6 text-indigo-600" />
          </button>
          
          <button 
            onClick={nextTestimonial}
            className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 md:-mr-8 z-10 bg-white p-2 rounded-full shadow-md hover:bg-indigo-100 transition-colors"
            aria-label="Next testimonial"
          >
            <FiChevronRight className="w-6 h-6 text-indigo-600" />
          </button>

          {/* Testimonial Cards */}
          <div className="overflow-hidden">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-xl shadow-md p-8 md:p-10"
            >
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                {/* Avatar */}
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-indigo-100 flex-shrink-0">
                  <Image
                    src={testimonials[current].avatar}
                    alt={testimonials[current].name}
                    width={96}
                    height={96}
                    className="object-cover"
                  />
                </div>

                {/* Content */}
                <div className="text-center md:text-left">
                  <div className="mb-4 text-indigo-500">
                    <FiMessageSquare className="w-8 h-8 opacity-20" />
                  </div>
                  <p className="text-lg text-gray-700 mb-6">
                    "{testimonials[current].content}"
                  </p>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-800">
                      {testimonials[current].name}
                    </h4>
                    <p className="text-gray-600">
                      {testimonials[current].role}
                    </p>
                    <div className="flex justify-center md:justify-start mt-2">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-5 h-5 ${i < testimonials[current].rating ? 'text-yellow-400' : 'text-gray-300'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Indicators */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-3 h-3 rounded-full ${i === current ? 'bg-indigo-600' : 'bg-gray-300'}`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;