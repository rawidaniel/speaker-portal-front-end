import { useRef, useEffect } from "react";
import { Settings, LogOut } from "lucide-react";
import { useAppDispatch } from "../store/hooks";
import { useLogoutMutation } from "../store/services/authApi";
import { logout } from "../store/slices/authSlice";
import { useNavigate } from "react-router-dom";

interface ProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileDropdown = ({ isOpen, onClose }: ProfileDropdownProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [logoutApi] = useLogoutMutation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      dispatch(logout());
      navigate("/login");
      onClose();
    }
  };

  const handleAccountSettings = () => {
    // Navigate to account settings page or open settings modal
    console.log("Navigate to account settings");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
      <div ref={dropdownRef} className="py-2">
        {/* User Info Section */}

        {/* Menu Items */}
        <div className="py-1">
          <button
            onClick={handleAccountSettings}
            className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
          >
            <Settings className="w-4 h-4 mr-3 text-gray-500" />
            Account Settings
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
          >
            <LogOut className="w-4 h-4 mr-3 text-gray-500" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileDropdown;
