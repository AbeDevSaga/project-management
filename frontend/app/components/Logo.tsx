import React from "react";
import Link from "next/link";
import Image from "next/image";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { TLogo } from "@/app/constants/type";
import Notification from "./Notification";
import Theme from "./Theme";
import LanguageSelection from "./LanguageSelection";

interface LogoProps {
  onToggleSidebar: () => void;
  logo: TLogo;
  isCollapsed?: boolean;
}

function Logo({ onToggleSidebar, logo, isCollapsed }: LogoProps) {
  return (
    <div className="box-shadow flex flex-col w-full">
      <div
        className={`flex-shrink-0 ${
          isCollapsed ? "py-2" : "py-2 px-4 lg:py-1"
        }`}
      >
        <div
          className={`flex items-center ${
            isCollapsed ? "justify-center" : "justify-between lg:justify-center"
          }`}
        >
          <Link
            href="/"
            className="flex items-center"
            onClick={onToggleSidebar}
          >
            <Image
              src={logo.src}
              alt={logo.alt}
              width={isCollapsed ? 32 : logo.width} // Use logo.width from props
              height={isCollapsed ? 32 : logo.height} // Use logo.height from props
              className={`w-auto ${
                isCollapsed ? "h-8 lg:h-11" : "h-10 lg:h-16"
              }`}
            />
          </Link>
          <div className="flex sm:hidden items-center justify-between">
            <Notification />
          </div>
          <div className="flex sm:hidden items-center justify-between">
            <Theme />
          </div>
          <button
            type="button"
            className="-m-2.5 p-2.5 lg:hidden text-gray-600 p-2 rounded-md hover:text-gray-800 transition-colors"
            onClick={onToggleSidebar}
          >
            <span className="sr-only">Close menu</span>
            <XMarkIcon className="h-6 w-6 cursor-pointer" />
          </button>
        </div>
      </div>
      <div className="flex sm:hidden w-full items-center justify-center">
        <LanguageSelection />
      </div>
    </div>
  );
}

export default Logo;
