"use client";
import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

interface NotificationCardProps {
  message: string;
  type: 'success' | 'error';
  duration?: number; // in milliseconds
  onClose?: () => void;
}

const NotificationCard: React.FC<NotificationCardProps> = ({
  message,
  type,
  duration = 3000,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      startExitAnimation();
    }, duration - 300); // Start exit animation 300ms before duration ends

    return () => clearTimeout(timer);
  }, [duration]);

  const startExitAnimation = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 300); // Match this with the animation duration
  };

  if (!isVisible) return null;

  const bgColor = type === 'success' ? 'bg-green-50' : 'bg-red-50';
  const textColor = type === 'success' ? 'text-green-800' : 'text-red-800';
  const borderColor = type === 'success' ? 'border-green-200' : 'border-red-200';
  const Icon = type === 'success' ? CheckCircle : XCircle;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div
        className={`${bgColor} ${borderColor} ${textColor} border rounded-lg shadow-lg p-4 transition-all duration-300 ease-in-out transform ${
          isExiting ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        } pointer-events-auto`}
      >
        <div className="flex items-center">
          <Icon className={`h-6 w-6 ${type === 'success' ? 'text-green-500' : 'text-red-500'} mr-2`} />
          <div className="flex-1">
            <p className="font-medium">{message}</p>
          </div>
          <button
            onClick={startExitAnimation}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label="Close notification"
          >
            <XCircle className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;