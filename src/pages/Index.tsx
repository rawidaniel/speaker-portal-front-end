import {
  Users,
  MessageCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setModalOpen, setSidebarOpen } from "../store/slices/uiSlice";
import {
  useGetEventsQuery,
  useCreateEventMutation,
} from "../store/services/eventsApi";
import { useLogoutMutation } from "../store/services/authApi";
import {
  setFormData,
  resetFormData,
  validateForm,
  setCurrentPage,
} from "../store/slices/eventsSlice";
import { logout } from "../store/slices/authSlice";
import Modal from "../components/Modal";
import AddEventForm from "../components/AddEventForm";

const Index = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { modalOpen, sidebarOpen } = useAppSelector((state: any) => state.ui);
  const { formData, isFormValid, formErrors, currentPage } = useAppSelector(
    (state: any) => state.events
  );
  const { user } = useAppSelector((state: any) => state.auth);

  // RTK Query hooks
  const { data: eventsResponse, isLoading } = useGetEventsQuery({
    page: currentPage,
    limit: 10,
  });
  const [createEvent, { isLoading: isCreating }] = useCreateEventMutation();
  const [logoutApi] = useLogoutMutation();

  const navigationItems = [
    { icon: MessageCircle, label: "Event Management", active: true },
  ];

  const handleCreateEvent = async () => {
    dispatch(validateForm());

    if (isFormValid) {
      try {
        // Convert duration string to number for API
        const eventData = {
          ...formData,
          duration: parseInt(formData.duration),
        };
        await createEvent(eventData).unwrap();
        dispatch(setModalOpen(false));
        dispatch(resetFormData());
        // You can add a success notification here
      } catch (error) {
        // You can add an error notification here
        console.error("Failed to create event:", error);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      dispatch(logout());
      navigate("/login");
    }
  };

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
  };

  // Extract events and pagination from response
  const events = eventsResponse?.data || [];
  const pagination = eventsResponse?.payload?.pagination;

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
              <a
                key={index}
                href="#"
                className={`
                  flex items-center px-4 py-3 rounded-lg transition-colors duration-200
                  ${
                    item.active
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }
                `}
              >
                <item.icon className="w-5 h-5 mr-3" />
                <span className="font-medium">{item.label}</span>
              </a>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">localhost:5174/contact-us</p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
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

            {/* Search bar */}

            {/* User profile */}
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogout}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                title="Logout"
              >
                <LogOut className="w-6 h-6" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                  {user?.photoUrl ? (
                    <img
                      src={user.photoUrl}
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
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-auto bg-white">
          <div className="p-6">
            {/* Page header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Event Management
                </h1>
                <p className="text-gray-600 mt-1">
                  Manage your events and submissions here.
                </p>
              </div>
              <button
                onClick={() => dispatch(setModalOpen(true))}
                className="mt-4 sm:mt-0 flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Add Event
              </button>
            </div>

            {/* Data table */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Start Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Duration
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Zoom Link
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {isLoading ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center">
                          <div className="text-gray-500">
                            <p className="text-lg font-medium">Loading...</p>
                          </div>
                        </td>
                      </tr>
                    ) : events.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center">
                          <div className="text-gray-500">
                            <p className="text-lg font-medium">
                              No Results Found!
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      events.map((event: any) => (
                        <tr key={event.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {event.title}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(event.dateTime).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {event.duration} minutes
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {event.zoomLink ? (
                              <a
                                href={event.zoomLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 underline"
                              >
                                Join Meeting
                              </a>
                            ) : (
                              "N/A"
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {pagination && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-700">
                  Showing page {pagination.page} of {pagination.lastPage}(
                  {pagination.total} total events)
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(pagination.prev || 1)}
                    disabled={!pagination.prev}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  {pagination.links.map((link: any) => (
                    <button
                      key={link.page}
                      onClick={() => handlePageChange(link.page)}
                      disabled={link.active}
                      className={`px-3 py-2 text-sm rounded-lg transition-colors duration-200 ${
                        link.active
                          ? "bg-blue-600 text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {link.label}
                    </button>
                  ))}

                  <button
                    onClick={() =>
                      handlePageChange(pagination.next || pagination.lastPage)
                    }
                    disabled={!pagination.next}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => {
          dispatch(setModalOpen(false));
          dispatch(resetFormData());
        }}
        title="Add New Event"
        confirmText={isCreating ? "Creating..." : "Create Event"}
        onConfirm={handleCreateEvent}
      >
        <AddEventForm
          formData={formData}
          setFormData={(data) => dispatch(setFormData(data))}
          errors={formErrors}
        />
      </Modal>
    </div>
  );
};

export default Index;
