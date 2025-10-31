import { Bell } from "lucide-react";

interface NavbarProps {
  setSidebarOpen: (open: boolean) => void;
  title?: string;
  rightContent?: React.ReactNode;
}

const Navbar: React.FC<NavbarProps> = ({
  setSidebarOpen,
  title,
  rightContent,
}) => {
  return (
    <nav className="bg-white flex justify-between py-6 px-8">
      <div className="flex items-center gap-3">
        {/* Mobile Sidebar Button */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden text-gray-600 hover:text-black"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {title && (
          <h1 className="font-bold text-black text-lg sm:text-xl md:text-2xl">
            {title}
          </h1>
        )}
      </div>

      <div className="flex items-center gap-5">
        <div className="relative">
          <Bell
            size={22}
            className="text-gray-600 cursor-pointer hover:text-black transition"
          />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
            3
          </span>
        </div>

        <img
          src="https://ui-avatars.com/api/?name=John+Doe&background=000000&color=ffffff"
          alt="User Avatar"
          className="w-8 h-8 rounded-full object-cover border border-gray-300 cursor-pointer"
        />

        {rightContent}
      </div>
    </nav>
  );
};

export default Navbar;
