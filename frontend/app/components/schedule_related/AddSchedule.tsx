import React, { useState, useEffect } from "react";
import ActionButton from "../ActionButton";
import { FiX, FiLink, FiBook, FiMapPin } from "react-icons/fi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { TProject } from "@/app/constants/type";

interface AddScheduleProps {
  closeAddSchedule: () => void;
  onAddSchedule: (scheduleData: any) => void;
  projects: TProject[];
  defaultProjectId?: string;
}

const AddSchedule: React.FC<AddScheduleProps> = ({
  closeAddSchedule,
  onAddSchedule,
  projects,
  defaultProjectId,
}) => {
  const [title, setTitle] = useState("in person"); // Default to "in person"
  const [description, setDescription] = useState("");
  const [type, setType] = useState("Zoom");
  const [link, setLink] = useState("");
  const [location, setLocation] = useState(""); // For in-person meetings
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [scheduleDate, setScheduleDate] = useState<Date | null>(new Date());
  const [errors, setErrors] = useState({
    title: false,
    description: false,
    project: false,
    date: false,
    location: false,
    link: false,
  });

  // Set default project if only one is provided
  useEffect(() => {
    if (projects.length === 1) {
      setSelectedProject(projects[0]._id || "");
    } else if (defaultProjectId) {
      setSelectedProject(defaultProjectId);
    }
  }, [projects, defaultProjectId]);

  const validateForm = () => {
    const newErrors = {
      title: !title.trim(),
      description: !description.trim(),
      project: !selectedProject,
      date: !scheduleDate,
      location: title === "in person" && !location.trim(),
      link: title === "online" && !link.trim(),
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleAddSchedule = () => {
    if (!validateForm()) {
      return;
    }

    const scheduleData = {
      title,
      description,
      project: selectedProject,
      type: title === "online" ? type : undefined,
      link: title === "online" ? link : undefined,
      location: title === "in person" ? location : undefined,
      date: scheduleDate,
    };

    onAddSchedule(scheduleData);
    closeAddSchedule();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center z-10">
          <h2 className="text-xl font-semibold text-primary">Add New Schedule</h2>
          <button
            onClick={closeAddSchedule}
            className="text-gray-500 hover:text-red-600 transition-colors"
            aria-label="Close modal"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Form */}
        <div className="p-4 md:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Schedule Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-primary">
                Schedule Details
              </h3>

              {/* Meeting Type */}
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Meeting Type *
                </label>
                <select
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="in person">In Person</option>
                  <option value="online">Online</option>
                </select>
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">Meeting type is required</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Description *
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    setErrors((prev) => ({ ...prev, description: false }));
                  }}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.description
                      ? "border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:ring-primary"
                  }`}
                  placeholder="Enter description"
                  rows={4}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">
                    Description is required
                  </p>
                )}
              </div>

              {/* Project Selection */}
              <div>
                <label
                  htmlFor="project"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Project *
                </label>
                {projects.length === 1 ? (
                  <div className="flex items-center px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">
                    <FiBook className="text-gray-500 mr-2" />
                    <span className="text-gray-700">
                      {projects[0].title}
                    </span>
                  </div>
                ) : (
                  <select
                    id="project"
                    value={selectedProject}
                    onChange={(e) => {
                      setSelectedProject(e.target.value);
                      setErrors((prev) => ({ ...prev, project: false }));
                    }}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.project
                        ? "border-red-500 focus:ring-red-200"
                        : "border-gray-300 focus:ring-primary"
                    }`}
                  >
                    <option value="">Select a project</option>
                    {projects.map((project) => (
                      <option key={project._id} value={project._id}>
                        {project.title}
                      </option>
                    ))}
                  </select>
                )}
                {errors.project && (
                  <p className="mt-1 text-sm text-red-600">Project is required</p>
                )}
              </div>
            </div>

            {/* Right Column - Meeting Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-primary">
                Meeting Details
              </h3>

              {/* Date Picker */}
              <div>
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Date & Time *
                </label>
                <div
                  className={`border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.date
                      ? "border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:ring-primary"
                  }`}
                >
                  <DatePicker
                    selected={scheduleDate}
                    onChange={(date) => {
                      setScheduleDate(date);
                      setErrors((prev) => ({ ...prev, date: false }));
                    }}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="MMMM d, yyyy h:mm aa"
                    className="w-full px-4 py-2 rounded-lg"
                    minDate={new Date()}
                  />
                </div>
                {errors.date && (
                  <p className="mt-1 text-sm text-red-600">
                    Date and time is required
                  </p>
                )}
              </div>

              {/* Conditional Fields */}
              {title === "online" ? (
                <>
                  {/* Meeting Platform */}
                  <div>
                    <label
                      htmlFor="type"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Meeting Platform *
                    </label>
                    <select
                      id="type"
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="Zoom">Zoom</option>
                      <option value="Google Meet">Google Meet</option>
                      <option value="Microsoft Teams">Microsoft Teams</option>
                      <option value="Skype">Skype</option>
                      <option value="Webex">Webex</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Meeting Link */}
                  <div>
                    <label
                      htmlFor="link"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Meeting Link *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiLink className="text-gray-500" />
                      </div>
                      <input
                        type="url"
                        id="link"
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                        className={`w-full pl-10 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                          errors.link
                            ? "border-red-500 focus:ring-red-200"
                            : "border-gray-300 focus:ring-primary"
                        }`}
                        placeholder="https://example.com/meeting"
                      />
                    </div>
                    {errors.link && (
                      <p className="mt-1 text-sm text-red-600">
                        Meeting link is required for online meetings
                      </p>
                    )}
                  </div>
                </>
              ) : (
                /* In-Person Location */
                <div>
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Meeting Location *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMapPin className="text-gray-500" />
                    </div>
                    <input
                      type="text"
                      id="location"
                      value={location}
                      onChange={(e) => {
                        setLocation(e.target.value);
                        setErrors((prev) => ({ ...prev, location: false }));
                      }}
                      className={`w-full pl-10 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                        errors.location
                          ? "border-red-500 focus:ring-red-200"
                          : "border-gray-300 focus:ring-primary"
                      }`}
                      placeholder="Enter meeting location"
                    />
                  </div>
                  {errors.location && (
                    <p className="mt-1 text-sm text-red-600">
                      Meeting location is required for in-person meetings
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex justify-end">
            <ActionButton
              label="Add Schedule"
              icon="calendar"
              onClick={handleAddSchedule}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSchedule;