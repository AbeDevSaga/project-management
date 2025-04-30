"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { TProject, TUser, TTask, TFile, TProposal } from "@/app/constants/type";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/redux/store";
import {
  deleteProject,
  fetchProjectById,
  updateProject,
} from "@/app/redux/slices/projectSlice";
import { toast } from "react-toastify";
import SectionHeader from "@/app/components/SectionHeader";
import ActionButton from "@/app/components/ActionButton";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useRouter } from "next/navigation";
import UserTable from "@/app/components/user_related/UsersTable";
import AddUser from "@/app/components/user_related/AddUser";
import { createUser } from "@/app/redux/slices/userSlice";
import UpdateProject from "@/app/components/project_related/UpdateProject";
import AddTask from "@/app/components/task_related/AddTask";
import {
  createTasks,
  fetchTasksByProjectId,
} from "@/app/redux/slices/taskSlice";
import TaskTable from "@/app/components/task_related/TaskTable";
import { fetchProposalByProject } from "@/app/redux/slices/proposalSlice";

const ProjectDetailPage = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { projectId } = useParams() as { projectId: string };
  const [project, setProject] = useState<TProject | null>(null);
  const [projectProposal, setProjectProposal] = useState<TProposal | null>(
    null
  );
  const [tasksList, setTasksList] = useState<TTask[]>([]);
  const [filesList, setFilesList] = useState<TFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showActions, setShowActions] = useState(false);
  const [addUserModalOpen, setAddUserModalOpen] = useState(false);
  const [addTaskModalOpen, setAddTaskModalOpen] = useState(false);
  const [addFileModalOpen, setAddFileModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<TProject | null>(null);

  // Open the modals

  const openAddUserModal = () => {
    setAddUserModalOpen(true);
  };
  const openAddTaskModal = () => {
    setAddTaskModalOpen(true);
  };
  const openAddFileModal = () => {
    setAddFileModalOpen(true);
  };
  const openUpdateModal = (project: TProject) => {
    setIsUpdateModalOpen(true);
    setSelectedProject(project);
  };
  const openDeleteModal = (project: TProject) => {
    setSelectedProject(project);
    setIsDeleteModalOpen(true);
  };

  // Handle modal actions
  const handleAddStudent = async (Student: TUser) => {
    console.log("New Student Data:", Student);
    const resultAction = await dispatch(createUser(Student));
    if (createUser.fulfilled.match(resultAction)) {
      console.log("User added successfully:", resultAction.payload);
      setAddUserModalOpen(false); // Close the modal after saving
    } else {
      console.error("Failed to add user:", resultAction.payload);
    }
  };
  const handleAddTasks = async (newTasks: TTask[]) => {
    console.log("New Task Data:", newTasks);
    try {
      // Dispatch the createTasks action
      const resultAction = await dispatch(createTasks(newTasks));

      if (createTasks.fulfilled.match(resultAction)) {
        // Success case
        const createdTasks = Array.isArray(resultAction.payload)
          ? resultAction.payload
          : [resultAction.payload];

        console.log("Tasks created successfully:", createdTasks);
        toast.success(`Successfully created ${createdTasks.length} task(s)`);
      } else if (createTasks.rejected.match(resultAction)) {
        // Error case
        console.error("Failed to create tasks:", resultAction.error);

        // Show error notification
        toast.error(`Failed to create tasks: ${resultAction.error.message}`);
      }
    } catch (error) {
      console.error("Unexpected error creating tasks:", error);
      // toast.error('An unexpected error occurred');
    } finally {
      setAddTaskModalOpen(false);
    }
  };

  const handleAddFile = (newFile: TFile) => {
    console.log("New File Data:", newFile);
    // Add file logic here
    setAddFileModalOpen(false);
  };

  const handleViewUser = (user: TUser) => {
    router.push(`${projectId}/user/${user._id}`);
  };

  const handleUpdateProject = async (updatedProject: TProject) => {
    console.log("Updated Project: ", updatedProject);
    if (selectedProject) {
      const resultAction = await dispatch(
        updateProject({
          id: selectedProject._id || "",
          projectData: updatedProject,
        })
      );
      if (updateProject.fulfilled.match(resultAction)) {
        console.log("Project updated successfully:", resultAction.payload);
        setIsUpdateModalOpen(false);
      } else {
        console.error("Failed to update Project:", resultAction.payload);
      }
    }
  };

  const handleDeleteProject = async () => {
    console.log("Deleting Project:", selectedProject);
    const resultAction = await dispatch(
      deleteProject(selectedProject?._id || "")
    );
    if (deleteProject.fulfilled.match(resultAction)) {
      console.log("Project deleted successfully:", resultAction.payload);
      setIsDeleteModalOpen(false);
      router.push("/projects"); // Redirect to projects page after deletion
    } else {
      console.error("Failed to delete Project:", resultAction.payload);
    }
  };

  const handleViewTask = (task: TTask) => {
    router.push(`${projectId}/tasks/${task._id}`);
  };

  const handleViewFile = (file: TFile) => {
    router.push(`${projectId}/files/${file._id}`);
  };

  // Close the modals
  const closeAddStudentModal = () => {
    setAddUserModalOpen(false);
  };
  const closeAddTaskModal = () => {
    setAddTaskModalOpen(false);
  };
  const closeAddFileModal = () => {
    setAddFileModalOpen(false);
  };
  const closeUpdateModal = () => {
    setIsUpdateModalOpen(false);
  };
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  // Fetch project data on component mount
  useEffect(() => {
    const fetchData = async () => {
      if (projectId) {
        try {
          setLoading(true);
          setError(null);

          // Fetch project details
          const projectResponse = await dispatch(fetchProjectById(projectId));
          if (fetchProjectById.fulfilled.match(projectResponse)) {
            const fetchedProject = projectResponse.payload;
            setProject(fetchedProject);
            // Set proposal if it exists in the project response
            // In your fetchData function:
            if (fetchedProject.proposal) {
              // If the project has a proposal attached
              setProjectProposal(fetchedProject.proposal);
            } else {
              // If fetching separately - assuming this returns a single proposal
              const proposalResponse = await dispatch(
                fetchProposalByProject(projectId)
              );
              if (fetchProposalByProject.fulfilled.match(proposalResponse)) {
                setProjectProposal(proposalResponse.payload); // Single proposal
              }
            }
          } else if (fetchProjectById.rejected.match(projectResponse)) {
            setError("Failed to fetch project data");
          }

          // Fetch tasks for the project
          const tasksResponse = await dispatch(
            fetchTasksByProjectId(projectId)
          );
          if (fetchTasksByProjectId.fulfilled.match(tasksResponse)) {
            setTasksList(tasksResponse.payload);
            console.log("Tasks List: ", tasksResponse.payload);
          } else {
            setError("Failed to fetch tasks");
          }

          // Fetch files for the project
          //   const filesResponse = await dispatch(fetchFilesByProjectId(projectId));
          //   if (fetchFilesByProjectId.fulfilled.match(filesResponse)) {
          //     setFilesList(filesResponse.payload);
          //   } else {
          //     setError("Failed to fetch files");
          //   }
        } catch (err) {
          setError("An unexpected error occurred");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [dispatch, projectId]);

  // Handle loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Handle error state
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Handle case where project data is not available
  if (!project) {
    return <div>Project not found</div>;
  }

  console.log("project: ", project);
  const hasApprovedProposal =
    projectProposal && projectProposal.status === "approved";
  console.log("projectProposal: ", projectProposal);

  return (
    <div className="w-full h-full relative space-y-4 mx-auto overflow-auto scrollbar-hide">
      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="absolute top-2 right-2">
          <BsThreeDotsVertical
            onClick={() => setShowActions(!showActions)}
            className="text-gray-600 cursor-pointer"
          />
        </div>
        {/* Actions */}
        {showActions && (
          <div className="absolute bg-white py-2 top-10 right-2 rounded-lg shadow-md">
            <div
              onClick={() =>
                openUpdateModal({
                  ...project,
                  _id: project._id || "",
                })
              }
              className="right-2 bg-white px-4 pb-2 cursor-pointer hover:text-primary duration-300"
            >
              Update Project
            </div>
            <div
              onClick={() =>
                openDeleteModal({
                  ...project,
                  _id: project._id || "",
                })
              }
              className="right-2 bg-white px-4 cursor-pointer border-t border-gray-200 pt-2 hover:text-red-500 duration-300"
            >
              Delete Project
            </div>
          </div>
        )}
        {/* Project Name and Description */}
        <div className="flex items-center space-x-4 mb-6">
          <h1 className="text-3xl font-bold text-gray-800">{project.title}</h1>
        </div>
        {project.description && (
          <p className="text-gray-600 mb-6">{project.description}</p>
        )}

        {/* Project Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Status */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-sm font-semibold text-gray-500">Status</h2>
            <p className="text-gray-800">{project.projectStatus}</p>
          </div>

          {/* Created By */}
          {project.advisor && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-sm font-semibold text-gray-500">Advisor</h2>
              <p className="text-gray-800">{project.advisor.username}</p>
            </div>
          )}

          {/* Organization */}
          {project.department && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-sm font-semibold text-gray-500">
                Department
              </h2>
              <p className="text-gray-800">{project.department.name}</p>
            </div>
          )}

          {/* Created Date */}
          {project.createdAt && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-sm font-semibold text-gray-500">
                Created At
              </h2>
              <p className="text-gray-800">
                {new Date(project.createdAt).toLocaleDateString()}
              </p>
            </div>
          )}
          {/* Proposal Section */}
          {projectProposal ? (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-sm font-semibold text-gray-500">
                  Project Proposal
                </h2>
                <div className="flex space-x-2">
                  {/* Download Button */}
                  <button
                    // onClick={() => downloadProposal(projectProposal._id)}
                    className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                    title="Download Proposal"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                  </button>

                  {/* Update Button */}
                  <button
                    // onClick={() => handleUpdateProposal(projectProposal)}
                    className="p-1 text-yellow-600 hover:text-yellow-800 transition-colors"
                    title="Update Proposal"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>

                  {/* Delete Button */}
                  <button
                    // onClick={() => handleDeleteProposal(projectProposal._id)}
                    className="p-1 text-red-600 hover:text-red-800 transition-colors"
                    title="Delete Proposal"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 truncate">
                    {projectProposal.file &&
                      projectProposal.file.split("/").pop()}
                  </p>
                  <div className="flex items-center mt-1">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        projectProposal.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : projectProposal.status === "rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      status: {projectProposal.status}
                    </span>
                    {projectProposal.feedback && (
                      <p className="ml-2 text-xs text-gray-500 truncate">
                        Feedback: {projectProposal.feedback}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 p-4 rounded-lg border border-dashed border-gray-300 hover:border-gray-400 transition-colors">
              <label className="flex flex-col items-center justify-center cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <span className="mt-2 text-sm font-medium text-gray-600">
                  Submit Proposal
                </span>
                <span className="text-xs text-gray-500">Click to upload</span>
                <input
                  type="file"
                  className="hidden"
                  // onChange={(e) => handleProposalUpload(e.target.files)}
                  accept=".pdf,.doc,.docx"
                />
              </label>
            </div>
          )}
        </div>
      </div>

      {/* User Section */}
      <div className="px-6 py-2 w-full h-full overflow-hidden relative bg-white rounded-lg shadow-md">
        <div className="flex items-center pb-2">
          <SectionHeader sectionKey="users" />
          <div className="w-auto">
            <ActionButton
              label="Add Student"
              onClick={openAddUserModal}
              icon="user"
            />
          </div>
        </div>
        {project.students && (
          <UserTable
            onViewUser={handleViewUser}
            users={project.students}
            px="4"
            py="4"
          />
        )}
      </div>

      {/* Tasks Section */}
      {hasApprovedProposal && (
        <div className="px-6 py-2 w-full h-full overflow-hidden relative bg-white rounded-lg shadow-md">
          <div className="flex items-center pb-2">
            <SectionHeader sectionKey="tasks" />
            <div className="w-auto">
              <ActionButton
                label="Add Task"
                onClick={openAddTaskModal}
                icon="task"
              />
            </div>
          </div>
          {tasksList && tasksList.length > 0 && (
            <TaskTable
              onViewTask={handleViewTask}
              tasks={tasksList}
              px="2"
              py="2"
            />
          )}
        </div>
      )}

      {/* Files Section */}
      {hasApprovedProposal && (
        <div className="px-6 py-2 w-full h-full overflow-hidden relative bg-white rounded-lg shadow-md">
          <div className="flex items-center pb-2">
            <SectionHeader sectionKey="files" />
            <div className="w-auto">
              <ActionButton
                label="Add File"
                onClick={openAddFileModal}
                icon="file"
              />
            </div>
          </div>
          {/* {filesList && filesList.length > 0 && (
          <FileTable
            onViewFile={handleViewFile}
            files={filesList}
            px="2"
            py="2"
          />
        )} */}
        </div>
      )}
      {/* Modals */}
      {addUserModalOpen && (
        <AddUser
          closeAddUser={closeAddStudentModal}
          onAddUser={handleAddStudent}
          role="student"
        />
      )}
      {addTaskModalOpen && (
        <AddTask
          closeAddTask={closeAddTaskModal}
          onAddTasks={handleAddTasks}
          projectId={projectId}
          projectUsers={project.students || []}
        />
      )}
      {isUpdateModalOpen && selectedProject && (
        <UpdateProject
          closeUpdateProject={closeUpdateModal}
          onUpdateProject={handleUpdateProject}
          projectToUpdate={selectedProject}
        />
      )}

      {/* Modals
      
      {addFileModalOpen && (
        <AddFile
          closeAddFile={closeAddFileModal}
          onAddFile={handleAddFile}
          projectId={projectId}
        />
      )}
      {isDeleteModalOpen && selectedProject && (
        <DeleteProject
          project={selectedProject}
          closeDeleteProject={closeDeleteModal}
          onDeleteProject={handleDeleteProject}
        />
      )} */}
    </div>
  );
};

export default ProjectDetailPage;
