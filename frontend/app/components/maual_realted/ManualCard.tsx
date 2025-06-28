import React, { useState } from "react";
import { TManual } from "@/app/constants/type";
import {
  FiDownload,
  FiEdit,
  FiTrash2,
  FiFileText,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { deleteManual, downloadManual } from "@/app/redux/slices/manualSlice";
import { AppDispatch, RootState } from "@/app/redux/store";
import { formatDate } from "@/app/utils/dateUtils";
import Alert from "../AlertProp";

interface ManualCardProps {
  manual: TManual;
  oUpdateModal?: (manual: TManual) => void;
  showActions?: boolean;
}

const ManualCard: React.FC<ManualCardProps> = ({
  manual,
  oUpdateModal,
  showActions = true,
}) => {
  const API_URL = process.env.NEXT_PUBLIC_MANUAL_API;
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch<AppDispatch>();
  const [alert, setAlert] = useState<{
    status: "success" | "error";
    text: string;
  } | null>(null);

  const handleDownload = async () => {
    try {
      await dispatch(downloadManual(manual._id ?? "")).unwrap();
      setAlert({
        status: "success",
        text: "Download started successfully",
      });
      window.open(`${API_URL}/download/${manual._id}`, "_blank");
    } catch (error) {
      setAlert({
        status: "error",
        text:
          error instanceof Error ? error.message : "Failed to download manual",
      });
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this manual?")) {
      try {
        await dispatch(deleteManual(manual._id ?? "")).unwrap();
        setAlert({
          status: "success",
          text: "Manual deleted successfully",
        });
      } catch (error) {
        setAlert({
          status: "error",
          text:
            error instanceof Error ? error.message : "Failed to delete manual",
        });
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300">
      <div className="p-4">
        <div className="flex items-start">
          <div className="bg-blue-100 p-3 rounded-lg mr-4">
            <FiFileText className="text-blue-600 text-xl" />
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              {manual.title}
            </h3>
            <p className="text-gray-600 text-sm mb-2">{manual.description}</p>

            <div className="flex flex-wrap gap-2 mt-3">
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                {manual.type}
              </span>
              <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                {manual.createdAt ? formatDate(manual.createdAt) : "N/A"}
              </span>
            </div>
          </div>
        </div>

        {showActions && (
          <div className="flex justify-center mt-4 space-x-2 border-t pt-3">
            <button
              onClick={handleDownload}
              className="flex items-center text-sm bg-green-100 text-green-700 px-4 py-1 rounded hover:bg-green-200 transition-colors"
            >
              <FiDownload className="mr-1" /> Download
            </button>

            {oUpdateModal && user?.role === "departmentHead" && (
              <button
                onClick={() => oUpdateModal(manual)}
                className="flex items-center text-sm bg-yellow-100 text-yellow-700 px-4 py-1 rounded hover:bg-yellow-200 transition-colors"
              >
                <FiEdit className="mr-1" /> Edit
              </button>
            )}

            {user?.role === "departmentHead" && (<button
              onClick={handleDelete}
              className="flex items-center text-sm bg-red-100 text-red-700 px-4 py-1 rounded hover:bg-red-200 transition-colors"
            >
              <FiTrash2 className="mr-1" /> Delete
            </button>)}
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

export default ManualCard;
