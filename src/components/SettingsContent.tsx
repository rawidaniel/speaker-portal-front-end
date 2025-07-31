import { Upload, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useUpdateProfileMutation } from "../store/services/userApi";
import { useGetCurrentUserQuery } from "../store/services/authApi";
import type { RootState } from "../store/store";

const SettingsContent = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get user state from Redux
  const { user: currentUser } = useSelector((state: RootState) => state.auth);

  // Use the mutation hook
  const [updateProfile, { isLoading, error, isSuccess }] =
    useUpdateProfileMutation();

  // Refetch user data when settings page loads to ensure fresh data
  useGetCurrentUserQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  // Form state
  const [formData, setFormData] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    contactInfo: currentUser?.contactInfo || "",
    bio: currentUser?.bio || "",
    image: null as File | null, // Changed from profileImage to image
  });

  const [previewImage, setPreviewImage] = useState<string | null>(
    currentUser?.photoUrl
      ? `http://localhost:3000${currentUser.photoUrl}`
      : null
  );

  // Update form data when user data changes
  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || "",
        email: currentUser.email || "",
        contactInfo: currentUser.contactInfo || "",
        bio: currentUser.bio || "",
        image: null,
      });
      setPreviewImage(
        currentUser.photoUrl
          ? `http://localhost:3000${currentUser.photoUrl}`
          : null
      );
    }
  }, [currentUser]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file, // Changed from profileImage to image
      }));

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleSaveChanges = async () => {
    // Prepare data for update (only include fields that have values)
    const updateData: Partial<{
      name: string;
      email: string;
      bio: string;
      contactInfo: string;
      image: File;
    }> = {};
    if (formData.name && formData.name !== currentUser?.name) {
      updateData.name = formData.name;
    }
    if (formData.email && formData.email !== currentUser?.email) {
      updateData.email = formData.email;
    }
    if (formData.contactInfo !== currentUser?.contactInfo) {
      updateData.contactInfo = formData.contactInfo;
    }
    if (formData.bio !== currentUser?.bio) {
      updateData.bio = formData.bio;
    }
    if (formData.image) {
      updateData.image = formData.image; // Changed from profileImage to image
    }

    // Only update if there are changes
    if (Object.keys(updateData).length > 0) {
      try {
        await updateProfile(updateData).unwrap();
        // The userApi will automatically update the auth state via onQueryStarted
        // No need to manually dispatch setUser here
      } catch (error: unknown) {
        console.error("Failed to update profile:", error);
      }
    }
  };

  return (
    <div className="p-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">
            Manage your Account settings and preference.
          </p>
        </div>
        <button
          onClick={handleSaveChanges}
          disabled={isLoading}
          className="mt-4 sm:mt-0 flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* Success/Error Messages */}
      {isSuccess && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
          Profile updated successfully!
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error && "data" in error
            ? (error.data as { message?: string })?.message ||
              "Failed to update profile"
            : "An error occurred"}
        </div>
      )}

      {/* Settings Content */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Account Information
            </h2>
            <p className="text-sm text-gray-600">
              Here you can edit information about yourself.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Image Uploader */}
            <div className="lg:col-span-1">
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div
                    onClick={handleImageClick}
                    className="w-32 h-32 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors overflow-hidden"
                  >
                    {previewImage ? (
                      <img
                        src={previewImage}
                        alt="Profile preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center">
                        <User className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-xs text-gray-500">Upload Image</p>
                      </div>
                    )}
                    <div className="absolute bottom-1 right-1 bg-blue-500 text-white p-1 rounded-full">
                      <Upload className="w-3 h-3" />
                    </div>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Click to upload profile image
                </p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="lg:col-span-2 space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email address"
                />
              </div>

              <div>
                <label
                  htmlFor="contactInfo"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Contact Info
                </label>
                <input
                  type="tel"
                  id="contactInfo"
                  name="contactInfo"
                  value={formData.contactInfo}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <label
                  htmlFor="bio"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Tell us about yourself..."
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsContent;
