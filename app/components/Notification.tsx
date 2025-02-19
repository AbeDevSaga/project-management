import React from 'react';
import { FaBell } from 'react-icons/fa'; 
import { insights } from '../constants/insights';

function Notification() {
  const notificationCount = insights.notifications.count; 

  return (
    <div className="relative border rounded-lg bg-white color p-2">
      {/* Notification Icon */}
      <FaBell className="w-5 h-5 text-gray-600 hover:text-gray-800 cursor-pointer" />

      {/* Notification Badge */}
      {notificationCount > 0 && (
        <div className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
          {notificationCount}
        </div>
      )}
    </div>
  );
}

export default Notification;