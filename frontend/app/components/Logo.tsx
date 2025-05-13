import Image from "next/image";
import haramaya from "@/public/images/haramaya.png";
const Logo = () => {
  return (
    <div className="flex flex-col items-center justify-center p-2 border-b border-gray-200 bg-gray-100">
      <div className="mb-1 w-16 h-16 relative">
        <Image
          src={haramaya}
          alt="Haramaya University Logo"
          fill
          className="object-contain"
        />
      </div>
      {/* University Name */}
      <h2 className="text-sm font-semibold text-center text-gray-700">
        Haramaya University
      </h2>
    </div>
  );
};
export default Logo;
