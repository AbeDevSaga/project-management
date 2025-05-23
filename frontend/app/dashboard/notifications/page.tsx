"use client";
import React, { useEffect, useState } from "react";
import { RootState, AppDispatch } from "@/app/redux/store";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserNotifications,
  markAllNotificationsAsRead,
  deleteNotification,
  markNotificationAsRead,
} from "@/app/redux/slices/notificationSlice";
import NotificationCard from "@/app/components/notification_related/NotificationCard";
import Alert from "@/app/components/AlertProp";
import AddNotification from "@/app/components/notification_related/AddNotification";

function Notifications() {
  const dispatch = useDispatch<AppDispatch>();
  const notificationList = useSelector((state: RootState) => state.notification.notifications);
  const user = useSelector((state: RootState) => state.auth.user);
  const [isAddNotificationOpen, setIsAddNotificationOpen] = useState(false);
  const [alert, setAlert] = useState<{
    status: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchUserNotifications(user._id));
    }
  }, [dispatch, user?._id]);

  const handleMarkAllAsRead = async () => {
    if (!user?._id) return;
    
    try {
      await dispatch(markAllNotificationsAsRead(user._id)).unwrap();
      setAlert({
        status: "success",
        text: "All notifications marked as read",
      });
    } catch (error) {
      setAlert({
        status: "error",
        text: error instanceof Error ? error.message : "Failed to mark notifications as read",
      });
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      await dispatch(deleteNotification(notificationId)).unwrap();
      setAlert({
        status: "success",
        text: "Notification deleted successfully",
      });
    } catch (error) {
      setAlert({
        status: "error",
        text: error instanceof Error ? error.message : "Failed to delete notification",
      });
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await dispatch(markNotificationAsRead(notificationId)).unwrap();
    } catch (error) {
      setAlert({
        status: "error",
        text: error instanceof Error ? error.message : "Failed to mark notification as read",
      });
    }
  };

  return (
    <div className="w-full h-full pb-2 relative mx-auto px-4 overflow-auto scrollbar-hide">
      {/* <div className="flex items-center justify-between pb-4">
        <SectionHeader sectionKey="notifications" />
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <ActionButton
              label={`Mark All as Read (${unreadCount})`}
              onClick={handleMarkAllAsRead}
            />
          )}
          {user?.role === "departmentHead" && (
            <ActionButton
              label="Create Notification"
              onClick={() => setIsAddNotificationOpen(true)}
            />
          )}
        </div>
      </div> */}

      {notificationList.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No notifications available
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {notificationList.map((notification) => (
            <NotificationCard
              key={notification._id}
              notification={notification}
            />
          ))}
        </div>
      )}

      {isAddNotificationOpen && (
        <AddNotification
          closeModal={() => setIsAddNotificationOpen(false)}
          userId={user?._id || ""}
        />
      )}

      {alert && (
        <Alert
          status={alert.status}
          text={alert.text}
          onClose={() => setAlert(null)}
        />
      )}
    </div>
  );
}

export default Notifications;