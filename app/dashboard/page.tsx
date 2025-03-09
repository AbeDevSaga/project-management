import React from "react";
import CountCard from "../components/CountCard";
import { statsData } from "../constants/dashboardStats";

function Dashboard() {
  return (
    <div className="w-full h-full text-white">
      <div className="grid grid-cols-1 sm:grid-cols-2  md:grid-cols-3 lg:grid-cols-4 gap-2 p-4">
        {statsData.map((statdata, index) => (
          <CountCard key={index} stats={statdata} />
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
