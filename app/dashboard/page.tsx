"use client";
import React, { useEffect } from "react";
import CountCard from "../components/CountCard";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/redux/store";
import { fetchAllUsers } from "@/app/redux/slices/userSlice";
import { TUser } from "@/app/constants/type";
import { statsData } from "../constants/dashboardStats";

function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const users = useSelector((state: RootState) => state.user.users);
  const loading = useSelector((state: RootState) => state.user.loading);
  const error = useSelector((state: RootState) => state.user.error);
  const [premiumUsers, setPremiumUsers] = React.useState<TUser[]>([]);
  const [activeUsers, setActiveUsers] = React.useState<TUser[]>([]);
  const [newUsers, setNewUsers] = React.useState<TUser[]>([]);

  useEffect(()=> {
    dispatch(fetchAllUsers());
  }, [dispatch])

  // Compute counts when users data changes
  useEffect(() => {
    if (users.length > 0) {
      // Filter premium users (role === "premium")
      const premiumUsers = users.filter((user) => user.isPremium === true);
      setPremiumUsers(premiumUsers);

      // Filter active users (status === "active")
      const activeUsers = users.filter((user) => user.status === "active");
      setActiveUsers(activeUsers);

      // Filter new users created today
      const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
      const newUsers = users.filter((user) => {
        const userCreatedAt = new Date(user.created_at).toISOString().split("T")[0];
        return userCreatedAt === today;
      });
      setNewUsers(newUsers);
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
      case "Premium Users":
        return { ...stat, value: `${premiumUsers.length}` };
      case "Active Users":
        return { ...stat, value: `${activeUsers.length}` };
      case "New Users":
        return { ...stat, value: `${newUsers.length}` };
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
