'use client';
import React, { useState } from "react";
import { TNotification } from "@/app/constants/type";
import { FiTrash2, FiBell, FiCheckCircle, FiCircle } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { 
  deleteNotification, 
  markNotificationAsRead 
} from "@/app/redux/slices/notificationSlice";
import { AppDispatch, RootState } from "@/app/redux/store";
import { formatDate } from "@/app/utils/dateUtils";
import Alert from "../AlertProp";

interface NotificationCardProps {
  notification: TNotification;
  showActions?: boolean;
}

const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  showActions = true,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const [alert, setAlert] = useState<{
    status: "success" | "error";
    text: string;
  } | null>(null);

  const handleMarkAsRead = async () => {
    try {
      await dispatch(markNotificationAsRead(notification._id)).unwrap();
      setAlert({
        status: "success",
        text: "Notification marked as read",
      });
    } catch (error) {
      setAlert({
        status: "error",
        text:
          error instanceof Error ? error.message : "Failed to update notification",
      });
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this notification?")) {
      try {
        await dispatch(deleteNotification(notification._id)).unwrap();
        setAlert({
          status: "success",
          text: "Notification deleted successfully",
        });
      } catch (error) {
        setAlert({
          status: "error",
          text:
            error instanceof Error ? error.message : "Failed to delete notification",
        });
      }
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden border-l-4 ${
      notification.status === 'unread' 
        ? 'border-blue-500 bg-blue-50' 
        : 'border-gray-200'
    } hover:shadow-lg transition-shadow duration-300`}>
      <div className="p-4">
        <div className="flex items-start">
          <div className={`p-3 rounded-lg mr-4 ${
            notification.status === 'unread' 
              ? 'bg-blue-100 text-blue-600' 
              : 'bg-gray-100 text-gray-600'
          }`}>
            <FiBell className="text-xl" />
          </div>

          <div className="flex-1">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                {notification.type}
              </h3>
              <span className="text-xs text-gray-500">
                {formatDate(notification.timestamp)}
              </span>
            </div>
            
            <p className="text-gray-600 text-sm mb-2">{notification.message}</p>

            <div className="flex flex-wrap gap-2 mt-3">
              <span className={`text-xs px-2 py-1 rounded ${
                notification.status === 'unread'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {notification.status}
              </span>
            </div>
          </div>
        </div>

        {showActions && (
          <div className="flex justify-end mt-4 space-x-2 border-t pt-3">
            <button
              onClick={handleMarkAsRead}
              disabled={notification.status === 'read'}
              className={`flex items-center text-sm px-3 py-1 rounded transition-colors ${
                notification.status === 'unread'
                  ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  : 'bg-gray-100 text-gray-500 cursor-not-allowed'
              }`}
            >
              {notification.status === 'unread' ? (
                <>
                  <FiCheckCircle className="mr-1" /> Mark as Read
                </>
              ) : (
                <>
                  <FiCircle className="mr-1" /> Read
                </>
              )}
            </button>

            <button
              onClick={handleDelete}
              className="flex items-center text-sm bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200 transition-colors"
            >
              <FiTrash2 className="mr-1" /> Delete
            </button>
          </div>
        )}
      </div>
      
      {alert && (
        <Alert
          status={alert.status}
          text={alert.text}
          onClose={() => setAlert(null)}
        />
      )}
    </div>
  );
};

export default NotificationCard;