import React from "react";
import { PiChartLineUpLight, PiChartLineDownLight } from "react-icons/pi";
import {
  FaChartLine,
  FaUserCheck,
  FaUserPlus,
  FaProjectDiagram,
} from "react-icons/fa";
import { FaUsers } from "react-icons/fa6";
import { HiCurrencyDollar } from "react-icons/hi2";
import { MdOutlineWorkspacePremium } from "react-icons/md";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

type IconMapping = {
  [key: string]: React.ComponentType<{ className?: string }>;
};

// Icon mapping type
const iconMapping: IconMapping = {
  users: FaUsers,
  newPlus: FaChartLine,
  dollarSign: HiCurrencyDollar,
  userPlus: FaUserPlus,
  userCheck:FaUserCheck,
  premium: MdOutlineWorkspacePremium,
  projects: FaProjectDiagram,
};

// Define the StatsProp interface where icon is a key of the iconMapping object
interface StatsProp {
  title: string;
  icon: string;
  value: string;
  decision: string;
  percentage: string;
  iconBg?: string;
  iconFg?: string; 
}

function CountCard({ stats }: { stats: StatsProp }) {
  
  const user = useSelector((state: RootState) => state.auth.user);
   if (stats.title === "Admins" && user?.role !== "admin") {
    return null;
  }
  const IconComponent = stats.icon ? iconMapping[stats.icon] : null;
  const trendColor = stats.decision === "increment" ? "text-green-500" : "text-red-500";
  const TrendIcon =
    stats.decision === "increment" ? PiChartLineUpLight : PiChartLineDownLight;

  return (
    (<div className="flex flex-col p-4 shadow-lg rounded-lg">
      <p className="text-foreground text-lg font-semibold">{stats.title}</p>
      <div className="flex items-center mt-2">
        <div
          className={`p-4 rounded-md ${stats.iconBg} ${stats.iconFg}`}
        >
          {IconComponent && <IconComponent className="w-7 h-7" />}
        </div>
        <div className="ml-4">
          <p className="text-titleFg text-2xl font-bold">{stats.value}</p>
          <div className={`flex items-center ${trendColor} mt-1`}>
            <TrendIcon className="w-6 h-6"/>
            <span className="text-sm ml-1">
              {stats.percentage}
            </span>
          </div>
        </div>
      </div>
    </div>)
  );
}

export default CountCard;
