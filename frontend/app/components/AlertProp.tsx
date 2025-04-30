import React, { useEffect, useState } from "react";
import { FiCheck, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

interface AlertProps {
  status: "success" | "error";
  text: string;
  duration?: number;
  onClose?: () => void;
}

const Alert: React.FC<AlertProps> = ({
  status,
  text,
  duration = 3000,
  onClose,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const colors = {
    success: "bg-green-100 text-green-700",
    error: "bg-red-100 text-red-700",
  };

  const icons = {
    success: <FiCheck className="text-green-500" />,
    error: <FiX className="text-red-500" />,
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className={`fixed bottom-4 right-4 flex items-center p-4 rounded-lg shadow-lg ${colors[status]}`}
      >
        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white mr-3">
          {icons[status]}
        </div>
        <span className="font-medium">{text}</span>
      </motion.div>
    </AnimatePresence>
  );
};

export default Alert;
