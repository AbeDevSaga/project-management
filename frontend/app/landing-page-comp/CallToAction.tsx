import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const CallToAction = () => {
  const router = useRouter();
  return (
    <section className="relative py-20 md:py-28 bg-gradient-to-r from-indigo-600 to-blue-600 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <Image
          src="/images/grid-pattern.svg"
          alt="Background pattern"
          fill
          className="object-cover"
        />
      </div>

      {/* Floating elements */}
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-400 rounded-full filter blur-3xl opacity-20"></div>
      <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-indigo-400 rounded-full filter blur-3xl opacity-20"></div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Transform Your School's Project Management?
          </h2>
          <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-3xl mx-auto">
            Join hundreds of educational institutions streamlining their final
            year projects with our platform.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              className="bg-white text-indigo-600 hover:bg-gray-100 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 ease-in-out text-lg font-semibold px-8 py-4 rounded-lg shadow-md"
              onClick={() => router.push("/auth/login")}
            >
              Login
            </button>
            {/* <button
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-indigo-600 transform hover:-translate-y-1 transition-all duration-300 ease-in-out text-lg font-semibold px-8 py-4 rounded-lg shadow-md"
              onClick={() => router.push("/auth/register")}
            >
              Sign Up
            </button> */}
          </div>

          <div className="mt-12 flex items-center justify-center gap-4">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden"
                >
                  <Image
                    src={`/images/avatar-${item}.jpg`}
                    alt={`User ${item}`}
                    width={40}
                    height={40}
                  />
                </div>
              ))}
            </div>
            <p className="text-blue-100 text-sm md:text-base">
              Trusted by{" "}
              <span className="font-semibold text-white">150+ schools</span>{" "}
              worldwide
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToAction;