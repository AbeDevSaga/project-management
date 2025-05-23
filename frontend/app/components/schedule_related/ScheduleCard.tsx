import React, { useState } from "react";
import { TSchedule } from "@/app/constants/type";
import { FiEdit, FiTrash2, FiCalendar, FiLink, FiUser } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { deleteSchedule } from "@/app/redux/slices/scheduleSlice";
import { toast } from "react-toastify";
import { AppDispatch, RootState } from "@/app/redux/store";
import { formatDate, getDaysRemaining } from "@/app/utils/dateUtils";
import Alert from "../AlertProp";

interface ScheduleCardProps {
  schedule: TSchedule;
  onUpdateModal?: (schedule: TSchedule) => void;
  showActions?: boolean;
}

const ScheduleCard: React.FC<ScheduleCardProps> = ({
  schedule,
  onUpdateModal,
  showActions = true,
}) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch<AppDispatch>();
  const [alert, setAlert] = useState<{
    status: "success" | "error";
    text: string;
  } | null>(null);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this schedule?")) {
      try {
        await dispatch(deleteSchedule(schedule._id ?? "")).unwrap();
        setAlert({
          status: "success",
          text: "Schedule deleted successfully",
        });
        toast.success("Schedule deleted successfully");
      } catch (error) {
        setAlert({
          status: "error",
          text:
            error instanceof Error ? error.message : "Failed to delete schedule",
        });
        toast.error("Failed to delete schedule");
      }
    }
  };

  // Calculate days remaining
  const daysRemaining = schedule.date ? getDaysRemaining(new Date(schedule.date)) : null;
  const isPast = daysRemaining !== null && daysRemaining < 0;
  console.log("shedule date: ", schedule.date);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300">
      <div className="p-4">
        <div className="flex items-start">
          <div className="bg-indigo-100 p-3 rounded-lg mr-4">
            <FiCalendar className="text-indigo-600 text-xl" />
          </div>

          <div className="flex-1">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                {schedule.title}
              </h3>
              {daysRemaining !== null && (
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    isPast
                      ? "bg-gray-100 text-gray-800"
                      : daysRemaining <= 1
                      ? "bg-red-100 text-red-800"
                      : daysRemaining <= 3
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {isPast
                    ? "Meeting passed"
                    : daysRemaining === 0
                    ? "Today"
                    : daysRemaining === 1
                    ? "Tomorrow"
                    : `${daysRemaining} days left`}
                </span>
              )}
            </div>

            <p className="text-gray-600 text-sm mb-2">{schedule.description}</p>

            <div className="flex flex-wrap gap-2 mt-3">
              <span className="flex items-center bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded">
                <FiUser className="mr-1" />
                {typeof schedule.createdBy === "object"
                  ? schedule.createdBy.username
                  : "N/A"}
              </span>

              {schedule.title === "online" && schedule.type && (
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  {schedule.type}
                </span>
              )}

              {schedule.date && (
                <span className="flex items-center bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                  <FiCalendar className="mr-1" />
                  {formatDate(schedule.date)}
                </span>
              )}

              {schedule.link && (
                <a
                  href={schedule.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center bg-green-100 text-green-800 text-xs px-2 py-1 rounded hover:bg-green-200"
                >
                  <FiLink className="mr-1" />
                  Join Meeting
                </a>
              )}
            </div>
          </div>
        </div>

        {showActions && (
          <div className="flex justify-center mt-4 space-x-2 border-t pt-3">
            {onUpdateModal && (user?.role === "advisor" || user?.role === "admin") && (
              <button
                onClick={() => onUpdateModal(schedule)}
                className="flex items-center text-sm bg-yellow-100 text-yellow-700 px-4 py-1 rounded hover:bg-yellow-200 transition-colors"
              >
                <FiEdit className="mr-1" /> Edit
              </button>
            )}

            {(user?.role === "advisor" || user?.role === "admin") && (
              <button
                onClick={handleDelete}
                className="flex items-center text-sm bg-red-100 text-red-700 px-4 py-1 rounded hover:bg-red-200 transition-colors"
              >
                <FiTrash2 className="mr-1" /> Delete
              </button>
            )}
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

export default ScheduleCard;