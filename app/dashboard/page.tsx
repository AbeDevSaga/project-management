import React from "react";
import CountCard from "../components/CountCard";
import { statsData } from "../constants/dashboardStats";

function Dashboard() {
  return (
    <div className="w-full h-full text-white">
      <div className="grid grid-cols-4 p-4">
        {statsData.map((statdata, index) => (
          <CountCard key={index} stats={statdata} />
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
