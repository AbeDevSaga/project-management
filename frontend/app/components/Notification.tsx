import React, { useEffect } from "react";
import { FaBell } from "react-icons/fa";
import { insights } from "../constants/insights";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { fetchUserNotifications } from "../redux/slices/notificationSlice";

function Notification() {
  const dispatch = useDispatch<AppDispatch>();
  const notificationList = useSelector(
    (state: RootState) => state.notification.notifications
  );
  const user = useSelector((state: RootState) => state.auth.user);
  useEffect(() => {
    if (user?._id) {
      dispatch(fetchUserNotifications(user._id));
    }
  }, [dispatch, user?._id]);

  return (
    <div className="relative border rounded-lg bg-white color p-2">
      {/* Notification Icon */}
      <FaBell className="w-5 h-5 text-gray-600 hover:text-gray-800 cursor-pointer" />
      {/* Notification Badge */}
      {notificationList.length > 0 && (
        <div className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
          {notificationList.length}
        </div>
      )}
    </div>
  );
}

export default Notification;
