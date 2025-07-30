import { Calendar, Clock } from "lucide-react";

interface FormData {
  title: string;
  description: string;
  dateTime: string;
  duration: string;
}

interface AddEventFormProps {
  formData: FormData;
  setFormData: (data: Partial<FormData>) => void;
  errors?: Record<string, string>;
}

const AddEventForm = ({
  formData,
  setFormData,
  errors = {},
}: AddEventFormProps) => {
  return (
    <div className="space-y-4">
      {/* Title Field */}
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Title
        </label>
        <input
          type="text"
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ title: e.target.value })}
          placeholder="Enter event title"
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.title ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title}</p>
        )}
      </div>

      {/* Description Field */}
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Description
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ description: e.target.value })}
          placeholder="Enter event description"
          rows={3}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
            errors.description ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
      </div>

      {/* Date & Time Field */}
      <div>
        <label
          htmlFor="dateTime"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Date & Time
        </label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="datetime-local"
            id="dateTime"
            value={formData.dateTime}
            onChange={(e) => setFormData({ dateTime: e.target.value })}
            className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.dateTime ? "border-red-500" : "border-gray-300"
            }`}
          />
        </div>
        {errors.dateTime && (
          <p className="mt-1 text-sm text-red-600">{errors.dateTime}</p>
        )}
      </div>

      {/* Duration Field */}
      <div>
        <label
          htmlFor="duration"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Duration (minutes)
        </label>
        <div className="relative">
          <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="number"
            id="duration"
            value={formData.duration}
            onChange={(e) => setFormData({ duration: e.target.value })}
            placeholder="Enter duration in minutes"
            min="1"
            className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.duration ? "border-red-500" : "border-gray-300"
            }`}
          />
        </div>
        {errors.duration && (
          <p className="mt-1 text-sm text-red-600">{errors.duration}</p>
        )}
      </div>
    </div>
  );
};

export default AddEventForm;
