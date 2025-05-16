"use client";
import ActionButton from "@/app/components/ActionButton";
import AddSchedule from "@/app/components/schedule_related/AddSchedule";
import ScheduleCard from "@/app/components/schedule_related/ScheduleCard";
import SectionHeader from "@/app/components/SectionHeader";
import { TProject } from "@/app/constants/type";
import { fetchAllProjects } from "@/app/redux/slices/projectSlice";
import {
  createSchedule,
  fetchSchedulesByProject,
  fetchSchedulesByUser,
} from "@/app/redux/slices/scheduleSlice";
import { AppDispatch, RootState } from "@/app/redux/store";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function Schedule() {
  const dispatch = useDispatch<AppDispatch>();
  const scheduleList = useSelector(
    (state: RootState) => state.schedule.schedules
  );
  const projectList = useSelector((state: RootState) => state.project.projects);
  const user = useSelector((state: RootState) => state.auth.user);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateManual, setShowUpdateManual] = useState(false);
  const [alert, setAlert] = useState<{
    status: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    dispatch(fetchAllProjects());
  }, [dispatch])

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user) {
          console.log("user role: ", user.role);
          if (user.role === "advisor") {
            await dispatch(fetchSchedulesByUser(user?._id || ""));
          } else {
            const projectResponse = await dispatch(fetchAllProjects());
            if (fetchAllProjects.fulfilled.match(projectResponse)) {
              const approvedProject = projectResponse.payload.filter(
                (project) => project.isApproved
              );
              console.log("approvedProject: ", approvedProject[0]._id);
              await dispatch(
                fetchSchedulesByProject(approvedProject[0]._id || "")
              );
            } else if (fetchAllProjects.rejected.match(projectResponse)) {
              setAlert({ status: "error", text: "Failed to fetch user data" });
            }
          }
        }
      } catch (err) {
        setAlert({
          status: "error",
          text: "Failed to load schedules and projects",
        });
      }
    };

    fetchData();
  }, [dispatch, user?._id]);

  // Open the Modals
  const openAddModal = () => {
    setShowAddModal(true);
  };
  const handleAddSchedule = async (scheduleData: any) => {
    try {
      const resultAction = await dispatch(
        createSchedule(scheduleData)
      ).unwrap();
      if (createSchedule.fulfilled.match(resultAction)) {
        setAlert({
          status: "success",
          text: "Schedule added successfully",
        });
        await dispatch(fetchSchedulesByUser(user?._id || ""));
      } else {
        setAlert({
          status: "error",
          text: "Failed to Add Schedule",
        });
      }
    } catch (error) {
      // Handle error
    }
  };

  // Close the modals
  const closeAddModal = () => {
    setShowAddModal(false);
  };
  const closeUpdateModal = () => {
    setShowUpdateManual(false);
  };

  return (
    <div className="w-full h-full pb-2 relative mx-auto px-4 overflow-auto scrollbar-hide">
      <div className="flex items-center pb-2">
        <SectionHeader sectionKey="users" />
        {user?.role === "advisor" && (
          <div className="w-auto">
            <ActionButton
              label="Create Schedule"
              onClick={openAddModal}
              icon="calendar"
            />
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {scheduleList.map((schedule) => (
          <ScheduleCard
            key={schedule._id}
            schedule={schedule}
            showActions={showUpdateManual}
          />
        ))}
      </div>
      {/* Add Schedule Modal */}
      {showAddModal && (
        <AddSchedule
          closeAddSchedule={() => setShowAddModal(false)}
          onAddSchedule={handleAddSchedule}
          projects={projectList}
        />
      )}
    </div>
  );
}

export default Schedule;
