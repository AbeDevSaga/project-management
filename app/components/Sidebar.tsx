"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { sidebarItems } from "../constants/sidebarItems";

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gray-800 text-white h-screen p-4">
      <h2 className="text-xl font-bold">Admin Panel</h2>
      <ul className="mt-4 space-y-2">
        {sidebarItems.map((item) => (
          <li key={item.path}>
            <Link
              href={item.path}
              className={`block p-2 rounded ${
                pathname === item.path ? "bg-gray-700" : ""
              }`}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
