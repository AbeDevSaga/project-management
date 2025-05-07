"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { TProject, TUser, TTask, TFile, TProposal } from "@/app/constants/type";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/redux/store";
import {
  addStudentsToProject,
  addUserToProject,
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
import {
  createUser,
  fetchUsersByDepartmentId,
} from "@/app/redux/slices/userSlice";
import UpdateProject from "@/app/components/project_related/UpdateProject";
import AddTask from "@/app/components/task_related/AddTask";
import {
  createTasks,
  fetchTasksByProjectId,
} from "@/app/redux/slices/taskSlice";
import TaskTable from "@/app/components/task_related/TaskTable";
import {
  createProposal,
  downloadProposal,
  fetchProposalByProject,
  updateProposal,
} from "@/app/redux/slices/proposalSlice";
import Alert from "@/app/components/AlertProp";
import UpdateProposal from "@/app/components/project_related/UpdateProposal";
import AddStudents from "@/app/components/project_related/AddStudents";
import ProjectProposal from "@/app/components/project_related/ProjectProposal";
import AddAdvisor from "@/app/components/project_related/AddAdvisor";
import { formatDate } from "@/app/utils/dateUtils";

const ProjectDetailPage = () => {
  const API_URL = process.env.NEXT_PUBLIC_PROPOSAL_API;
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const { projectId } = useParams() as { projectId: string };
  const [project, setProject] = useState<TProject | null>(null);
  const [departmentUsers, setDepartmentUsers] = useState<TUser[]>([]);
  const [projectProposal, setProjectProposal] = useState<TProposal | null>(
    null
  );
  const [tasksList, setTasksList] = useState<TTask[]>([]);
  const [filesList, setFilesList] = useState<TFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showActions, setShowActions] = useState(false);
  const [addUserModalOpen, setAddUserModalOpen] = useState(false);
  const [addAdvisorModalOpen, setAddAdvisorModalOpen] = useState(false);
  const [addTaskModalOpen, setAddTaskModalOpen] = useState(false);
  const [addFileModalOpen, setAddFileModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isUpdateProposalOpen, setIsUpdateProposalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<TProject | null>(null);
  const [alert, setAlert] = useState<{
    status: "success" | "error";
    text: string;
  } | null>(null);

  // Open the modals

  const openAddUserModal = () => {
    setAddUserModalOpen(true);
  };
  const openAddAdvisorModal = () => {
    setAddAdvisorModalOpen(true);
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
  const openUpdateProposal = () => {
    setIsUpdateProposalOpen(true);
  };
  const openDeleteModal = (project: TProject) => {
    setSelectedProject(project);
    setIsDeleteModalOpen(true);
  };

  // Handle modal actions
  const handleAddStudents = async (studentIds: string[], projectId: string) => {
    try {
      await dispatch(addStudentsToProject({ projectId, studentIds })).unwrap();
      toast.success("Students added successfully");
    } catch (error) {
      toast.error("Failed to add students");
    }
  };
  const handleAddUser = async (userId: string, projectId: string, role:string) => {
    try {
      await dispatch(addUserToProject({ projectId, userId, role })).unwrap();
      setAlert({
        status: "success",
        text: `${role} added successfully`,
      });
    } catch (error) {
      setAlert({
        status: "error",
        text: `Failed to add ${role}`,
      });
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

  const handleUpdateProposal = async (formData: FormData) => {
    try {
      // Then update the status and feedback
      await dispatch(
        updateProposal({
          id: projectProposal?._id || " ",
          formData,
        })
      ).unwrap();

      setAlert({
        status: "success",
        text: "Proposal updated successfully",
      });
    } catch (error) {
      setAlert({
        status: "error",
        text: "Failed to update proposal",
      });
    }
  };

  const handleViewTask = (task: TTask) => {
    router.push(`${projectId}/tasks/${task._id}`);
  };

  const handleViewFile = (file: TFile) => {
    router.push(`${projectId}/files/${file._id}`);
  };

  //handle download proposal
  const handleDownloadProposal = async (proposal: TProject) => {
    try {
      await dispatch(downloadProposal(proposal._id ?? "")).unwrap();
      setAlert({
        status: "success",
        text: "Download started successfully",
      });
      window.open(`${API_URL}/download/${proposal._id}`, "_blank");
    } catch (error) {
      setAlert({
        status: "error",
        text:
          error instanceof Error
            ? error.message
            : "Failed to download Proposal",
      });
    }
  };

  //handle delete proposal
  const handleDeleteProposal = async (proposal: TProject) => {
    if (window.confirm("Are you sure you want to delete this Proposal?")) {
      try {
        await dispatch(downloadProposal(proposal._id ?? "")).unwrap();
        setAlert({
          status: "success",
          text: "Proposal deleted successfully",
        });
      } catch (error) {
        setAlert({
          status: "error",
          text:
            error instanceof Error
              ? error.message
              : "Failed to delete Proposal",
        });
      }
    }
  };
  // Handle proposal upload
  const handleProposalUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      setAlert({
        status: "error",
        text: "Only PDF and Word documents are allowed",
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("project", projectId);
    formData.append("student", project?.students?.[0]?._id || ""); // Assuming first student is the submitter

    try {
      const resultAction = await dispatch(createProposal(formData));
      if (createProposal.fulfilled.match(resultAction)) {
        setProjectProposal(resultAction.payload);
        setAlert({
          status: "success",
          text: "Proposal uploaded successfully",
        });
      } else {
        throw new Error(resultAction.payload as string);
      }
    } catch (error) {
      setAlert({
        status: "error",
        text: "Failed to upload proposal",
      });
    }
  };

  // Close the modals
  const closeAddStudentModal = () => {
    setAddUserModalOpen(false);
  };
  const closeAddAdvisorModal = () => {
    setAddAdvisorModalOpen(false);
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
  const closeUpdateProposal = () => {
    setIsUpdateProposalOpen(false);
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

          // Fetch project details first to get department ID
          const projectResponse = await dispatch(fetchProjectById(projectId));

          if (fetchProjectById.fulfilled.match(projectResponse)) {
            const fetchedProject = projectResponse.payload;
            setProject(fetchedProject);

            // Set proposal if it exists in the project response
            if (fetchedProject.proposal) {
              setProjectProposal(fetchedProject.proposal);
            } else {
              // If fetching separately
              const proposalResponse = await dispatch(
                fetchProposalByProject(projectId)
              );
              if (fetchProposalByProject.fulfilled.match(proposalResponse)) {
                setProjectProposal(proposalResponse.payload);
              }
            }

            // Now that we have the project, fetch department users
            if (fetchedProject.department?._id) {
              const departmentId = fetchedProject.department._id;
              const userResponse = await dispatch(
                fetchUsersByDepartmentId(departmentId)
              );

              if (fetchUsersByDepartmentId.fulfilled.match(userResponse)) {
                setDepartmentUsers(userResponse.payload);
                console.log("Department Users: ", userResponse.payload);
              } else {
                setError("Failed to fetch Department Users");
              }
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

            // Fetch files for the project (commented out as in original)
            // const filesResponse = await dispatch(fetchFilesByProjectId(projectId));
            // if (fetchFilesByProjectId.fulfilled.match(filesResponse)) {
            //   setFilesList(filesResponse.payload);
            // } else {
            //   setError("Failed to fetch files");
            // }
          } else if (fetchProjectById.rejected.match(projectResponse)) {
            setError("Failed to fetch project data");
          }
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
            <p className="text-gray-800">
              {project.isApproved ? "Approved" : "Rejected"}
            </p>
          </div>

          {/* Created By */}
          {project.advisor ? (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-sm font-semibold text-gray-500">Advisor</h2>
              <p className="text-gray-800">{project.advisor.username}</p>
            </div>
          ) : (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-sm font-semibold text-red-400">Advisor ?</h2>
              <p
                onClick={openAddAdvisorModal}
                className="text-blue-500 cursor-pointer hover:text-blue-700 transition-transform duration-300 ease-in-out"
              >
                Assign Advisor +
              </p>
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
          <ProjectProposal
            user={user}
            project={project}
            proposal={projectProposal}
            onDownload={handleDownloadProposal}
            onDelete={handleDeleteProposal}
            onUpdate={openUpdateProposal}
            setProjectProposal={setProjectProposal}
          />
          {project.projectStatus === "completed" &&
            (project.evaluation ? (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-sm font-semibold text-gray-500">
                  Evaluator
                </h2>
                <p className="text-gray-800">
                  {project.evaluation?.evaluator.username}
                </p>
                <div className="flex items-center space-x-2 justify-end">
                  <h2 className="text-sm font-semibold text-green-500">
                    Date:
                  </h2>
                  <p className="text-gray-800">
                    {project.evaluation?.date &&
                      formatDate(project.evaluation?.date)}
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-sm font-semibold text-red-400">
                  Evaluator ?
                </h2>
                <p
                  onClick={openAddAdvisorModal}
                  className="text-blue-500 cursor-pointer hover:text-blue-700 transition-transform duration-300 ease-in-out"
                >
                  Assign Evaluator +
                </p>
              </div>
            ))}
        </div>
      </div>

      {/* User Section */}
      <div className="px-6 py-2 w-full h-full overflow-hidden relative bg-white rounded-lg shadow-md">
        <div className="flex items-center pb-2">
          <SectionHeader sectionKey="users" />
          {/* <div className="w-auto">
            <ActionButton
              label="Add Student"
              onClick={openAddUserModal}
              icon="user"
            />
          </div> */}
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
        <AddStudents
          users={departmentUsers}
          projectId={projectId}
          closeAddStudents={closeAddStudentModal}
          onAddStudents={handleAddStudents}
        />
      )}
      {addAdvisorModalOpen && (
        <AddAdvisor
          users={departmentUsers}
          projectId={projectId}
          closeAddAdvisor={closeAddAdvisorModal}
          onAddAdvisor={handleAddUser}
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
      {isUpdateProposalOpen && projectProposal && (
        <UpdateProposal
          closeUpdateProposal={closeUpdateProposal}
          onUpdateProposal={handleUpdateProposal}
          proposalToUpdate={projectProposal}
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
      {alert && (
        <Alert
          status={alert.status}
          text={alert.text}
          onClose={() => setAlert(null)}
        />
      )}
    </div>
  );
};

export default ProjectDetailPage;
