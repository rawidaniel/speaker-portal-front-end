import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, Users } from "lucide-react";
import {
  useGetEventResponsesQuery,
  useGetEventByIdQuery,
} from "../store/services/eventsApi";
import Layout from "../components/Layout";

const EventResponses = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();

  // RTK Query hooks
  const {
    data: responsesData,
    isLoading: isLoadingResponses,
    error: responsesError,
  } = useGetEventResponsesQuery(eventId!, { skip: !eventId });

  const {
    data: eventDetails,
    isLoading: isLoadingEvent,
    error: eventError,
  } = useGetEventByIdQuery(eventId!, { skip: !eventId });

  const isLoading = isLoadingResponses || isLoadingEvent;
  const error = responsesError || eventError;

  const responses = responsesData?.data || [];

  const getResponseCount = (status: "YES" | "NO" | "MAYBE") => {
    return responses.filter((response) => response.status === status).length;
  };

  const getResponseColor = (status: "YES" | "NO" | "MAYBE") => {
    switch (status) {
      case "YES":
        return "bg-green-100 text-green-800";
      case "NO":
        return "bg-red-100 text-red-800";
      case "MAYBE":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading event responses...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-red-600">
              {error && "data" in error
                ? (error.data as { message?: string })?.message ||
                  "An error occurred"
                : "Failed to load event responses"}
            </p>
            <button
              onClick={() => navigate(-1)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Event Responses
              </h1>
              <p className="text-sm text-gray-500">
                {eventDetails?.title || "Event Details"}
              </p>
            </div>
          </div>
        </div>

        {/* Event Details */}
        {eventDetails && (
          <div className="mb-6">
            <div className="bg-white rounded-lg shadow p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center space-x-4">
                <Calendar className="w-6 h-6 text-blue-600" />
                <span className="text-gray-700 font-medium">
                  {new Date(eventDetails.dateTime).toLocaleString()}
                </span>
                <Clock className="w-5 h-5 text-gray-400 ml-4" />
                <span className="text-gray-500">
                  {eventDetails.duration} min
                </span>
                {eventDetails.zoomLink && (
                  <a
                    href={eventDetails.zoomLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-4 text-blue-600 underline"
                  >
                    Zoom Link
                  </a>
                )}
              </div>
              <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                <Users className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">
                  {responses.length} responses
                </span>
                <span className="ml-4 text-green-600">
                  Yes: {getResponseCount("YES")}
                </span>
                <span className="ml-2 text-yellow-600">
                  Maybe: {getResponseCount("MAYBE")}
                </span>
                <span className="ml-2 text-red-600">
                  No: {getResponseCount("NO")}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Responses Table */}
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Response
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Responded At
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {responses.map((response) => (
                <tr key={response.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {response.user.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {response.user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getResponseColor(
                        response.status
                      )}`}
                    >
                      {response.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(response.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
              {responses.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-4 text-center text-gray-400"
                  >
                    No responses yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default EventResponses;
