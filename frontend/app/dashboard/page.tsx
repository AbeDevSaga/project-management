"use client";
import React, { useEffect } from "react";
import CountCard from "../components/CountCard";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/redux/store";
import { fetchAllUsers } from "@/app/redux/slices/userSlice";
import { TUser } from "@/app/constants/type";
import { statsData } from "../constants/dashboardStats";
import { fetchAllProjects } from "../redux/slices/projectSlice";

function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const users = useSelector((state: RootState) => state.user.users);
  const projects = useSelector((state: RootState) => state.project.projects);
  const loading = useSelector((state: RootState) => state.user.loading);
  const error = useSelector((state: RootState) => state.user.error);
  const [students, setStudents] = React.useState<TUser[]>([]);
  const [advisors, setAdvisors] = React.useState<TUser[]>([]);
  const [deptHead, setDeptHead] = React.useState<TUser[]>([]);
  const [admins, setAdmins] = React.useState<TUser[]>([]);

  useEffect(() => {
    dispatch(fetchAllUsers());
    dispatch(fetchAllProjects());
  }, [dispatch]);

  // Compute counts when users data changes
  useEffect(() => {
    if (users.length > 0) {
      // Filter premium users (role === "premium")
      const advisors = users.filter((user) => user.role === "advisor");
      setAdvisors(advisors);

      const admins = users.filter((user) => user.role === "admin");
      setAdmins(admins);

      const students = users.filter((user) => user.role === "student");
      setStudents(students);

      const deptHead = users.filter((user) => user.role === "departmentHead");
      setDeptHead(deptHead);
    }
  }, [users]);

  // Handle loading state
  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center text-white">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center text-white">
        <div className="text-2xl text-red-500">Error: {error}</div>
      </div>
    );
  }

  const updatedStatsData = statsData.map((stat) => {
    switch (stat.title) {
      case "Total Users":
        return { ...stat, value: `${users.length}` };
      case "Admins":
        return { ...stat, value: `${admins.length}` };
      case "Students":
        return { ...stat, value: `${students.length}` };
      case "Advisors":
        return { ...stat, value: `${advisors.length}` };
      case "Department Heads":
        return { ...stat, value: `${deptHead.length}` };
      case "Projects":
        return { ...stat, value: `${projects.length}` };
      default:
        return stat;
    }
  });

  return (
    <div className="w-full h-full text-white">
      <div className="grid grid-cols-1 sm:grid-cols-2  md:grid-cols-3 lg:grid-cols-4 gap-2 p-4">
        {updatedStatsData.map((statdata, index) => (
          <CountCard key={index} stats={statdata} />
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
