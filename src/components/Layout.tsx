import {
  Users,
  MessageCircle,
  ChevronDown,
  Menu,
  X,
  Settings,
} from "lucide-react";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setSidebarOpen } from "../store/slices/uiSlice";
import ProfileDropdown from "./ProfileDropdown";
import { useLocation, useNavigate } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { sidebarOpen } = useAppSelector((state: any) => state.ui);
  const { user } = useAppSelector((state: any) => state.auth);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [previewImage] = useState<string | undefined>(
    user?.photoUrl ? `http://localhost:3000${user.photoUrl}` : undefined
  );

  // Determine current page based on location
  const isSettingsPage = location.pathname === "/settings";
  // const isEventResponsesPage =
  //   location.pathname.includes("/events/") &&
  //   location.pathname.includes("/responses");

  const navigationItems = [
    {
      icon: MessageCircle,
      label: "Event Management",
      active: !isSettingsPage, // Keep Event Management highlighted when on responses page
      path: "/",
    },
    {
      icon: Settings,
      label: "Settings",
      active: isSettingsPage,
      path: "/settings",
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => dispatch(setSidebarOpen(false))}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center p-6 border-b border-gray-200">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mr-3">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-xl font-bold text-blue-600">
              Speaker Portal
            </span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigationItems.map((item, index) => (
              <button
                key={index}
                onClick={() => navigate(item.path)}
                className={`
                  w-full flex items-center px-4 py-3 rounded-lg transition-colors duration-200
                  ${
                    item.active
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }
                `}
              >
                <item.icon className="w-5 h-5 mr-3" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center px-6 py-4">
            {/* Mobile menu button */}
            <button
              onClick={() => dispatch(setSidebarOpen(!sidebarOpen))}
              className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              {sidebarOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>

            {/* User profile and dropdown pushed to right */}
            <div className="flex items-center space-x-4 ml-auto relative">
              <div
                className="flex items-center space-x-3 cursor-pointer"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              >
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                  {user?.photoUrl ? (
                    <img
                      src={previewImage}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <Users className="w-6 h-6 text-gray-600" />
                  )}
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.name || "User"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user?.email || "user@example.com"}
                  </p>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                    profileDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </div>

              {/* Profile Dropdown */}
              <ProfileDropdown
                isOpen={profileDropdownOpen}
                onClose={() => setProfileDropdownOpen(false)}
              />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
