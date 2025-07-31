import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setModalOpen } from "../store/slices/uiSlice";
import {
  useGetEventsQuery,
  useCreateEventMutation,
} from "../store/services/eventsApi";
import {
  setFormData,
  resetFormData,
  validateForm,
  setCurrentPage,
} from "../store/slices/eventsSlice";
import Modal from "../components/Modal";
import AddEventForm from "../components/AddEventForm";
import SettingsContent from "../components/SettingsContent";
import Layout from "../components/Layout";
import { useLocation, useNavigate } from "react-router-dom";

const Index = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { modalOpen } = useAppSelector((state: any) => state.ui);
  const { formData, isFormValid, formErrors, currentPage } = useAppSelector(
    (state: any) => state.events
  );

  // Determine current page based on location
  const isSettingsPage = location.pathname === "/settings";

  // RTK Query hooks
  const { data: eventsResponse, isLoading } = useGetEventsQuery({
    page: currentPage,
    limit: 10,
  });
  const [createEvent, { isLoading: isCreating }] = useCreateEventMutation();

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

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
  };

  // Extract events and pagination from response
  const events = eventsResponse?.data || [];
  const pagination = eventsResponse?.payload?.pagination;

  return (
    <Layout>
      {isSettingsPage ? (
        <SettingsContent />
      ) : (
        <div className="p-6">
          {/* Page header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Event Management
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your events and track responses.
              </p>
            </div>
            <button
              onClick={() => dispatch(setModalOpen(true))}
              className="mt-4 sm:mt-0 flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Add Event
            </button>
          </div>

          {/* Events Table */}
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
                      <tr
                        key={event.id}
                        className="cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() =>
                          navigate(`/events/${event.id}/responses`)
                        }
                      >
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
                              onClick={(e) => e.stopPropagation()}
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
      )}

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
    </Layout>
  );
};

export default Index;
