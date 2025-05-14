"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { TTask, TUser, TProject } from "@/app/constants/type";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/redux/store";
import {
  fetchTaskById,
  updateTask,
  deleteTask,
} from "@/app/redux/slices/taskSlice";
import { fetchProjectById } from "@/app/redux/slices/projectSlice";
import { toast } from "react-toastify";
import SectionHeader from "@/app/components/SectionHeader";
import { BsThreeDotsVertical } from "react-icons/bs";
import UserTable from "@/app/components/user_related/UsersTable";
import StatusBadge from "@/app/components/user_related/StatusBadge";
import UpdateTask from "@/app/components/task_related/UpdateTask";
import DeleteTask from "@/app/components/task_related/DeleteTask";

const TaskDetailPage = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { taskId } = useParams() as { taskId: string };
  const [task, setTask] = useState<TTask | null>(null);
  const [project, setProject] = useState<TProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showActions, setShowActions] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Fetch task and project data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch task details
        const taskResponse = await dispatch(fetchTaskById(taskId));
        if (fetchTaskById.fulfilled.match(taskResponse)) {
          setTask(taskResponse.payload);

          // Fetch associated project if task exists
          if (taskResponse.payload.projectId) {
            const projectResponse = await dispatch(
              fetchProjectById(taskResponse.payload.projectId)
            );
            if (fetchProjectById.fulfilled.match(projectResponse)) {
              setProject(projectResponse.payload);
            }
          }
        } else {
          setError("Failed to fetch task data");
        }
      } catch (err) {
        setError("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch, taskId]);

  // Modal handlers
  const openUpdateModal = () => {
    setIsUpdateModalOpen(true);
  };

  const openDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const closeUpdateModal = () => {
    setIsUpdateModalOpen(false);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleUpdateTask = async (updatedTask: TTask) => {
    console.log("updating asj: ", updatedTask)
    if (!task) return;

    // const resultAction = await dispatch(
    //   updateTask({
    //     id: task._id,
    //     taskData: updatedTask,
    //   })
    // );

    // if (updateTask.fulfilled.match(resultAction)) {
    //   setTask(resultAction.payload);
    //   toast.success("Task updated successfully");
    //   closeUpdateModal();
    // } else {
    //   toast.error("Failed to update task");
    // }
  };

  const handleDeleteTask = async () => {
    if (!task) return;

    const resultAction = await dispatch(deleteTask(task._id));
    if (deleteTask.fulfilled.match(resultAction)) {
      toast.success("Task deleted successfully");
      router.push(`/projects/${task.projectId}/tasks`);
    } else {
      toast.error("Failed to delete task");
    }
  };

  const handleViewUser = (user: TUser) => {
    router.push(`/users/${user._id}`);
  };

  // Format date for display
  const formatDate = (date: Date | string | undefined) => {
    if (!date) return "Not set";
    return new Date(date).toLocaleDateString();
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!task) return <div>Task not found</div>;

  return (
    <div className="w-full h-full relative space-y-4 mx-auto overflow-auto scrollbar-hide">
      <div className="p-6 bg-white rounded-lg shadow-md">
        {/* Action Menu */}
        <div className="absolute top-2 right-2">
          <BsThreeDotsVertical
            onClick={() => setShowActions(!showActions)}
            className="text-gray-600 cursor-pointer"
          />
        </div>
        {showActions && (
          <div className="absolute bg-white py-2 top-10 right-2 rounded-lg shadow-md z-10">
            <div
              onClick={openUpdateModal}
              className="px-4 pb-2 cursor-pointer hover:text-primary duration-300"
            >
              Update Task
            </div>
            <div
              onClick={openDeleteModal}
              className="px-4 cursor-pointer border-t border-gray-200 pt-2 hover:text-red-500 duration-300"
            >
              Delete Task
            </div>
          </div>
        )}

        {/* Task Header */}
        <div className="flex items-center space-x-4 mb-6">
          <h1 className="text-3xl font-bold text-gray-800">{task.taskName}</h1>
          <StatusBadge status={task.status} />
        </div>

        {task.discription && (
          <p className="text-gray-600 mb-6">{task.discription}</p>
        )}

        {/* Task Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {/* Project */}
          {project && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-sm font-semibold text-gray-500">Project</h2>
              <p className="text-gray-800">{project.title}</p>
            </div>
          )}

          {/* Start Date */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-sm font-semibold text-gray-500">Start Date</h2>
            <p className="text-gray-800">{formatDate(task.startDate)}</p>
          </div>

          {/* End Date */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-sm font-semibold text-gray-500">End Date</h2>
            <p className="text-gray-800">{formatDate(task.endDate)}</p>
          </div>

          {/* Progress */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-sm font-semibold text-gray-500">Progress</h2>
            <div className="flex items-center gap-2">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full ${
                    task.status === "completed"
                      ? "bg-green-600"
                      : task.status === "in-progress"
                      ? "bg-blue-600"
                      : "bg-gray-400"
                  }`}
                  style={{
                    width:
                      task.status === "completed"
                        ? "100%"
                        : task.status === "in-progress"
                        ? task.percentage || "50%"
                        : "0%",
                  }}
                ></div>
              </div>
              <span className="text-sm text-gray-600">
                {task.status === "completed"
                  ? "100%"
                  : task.status === "in-progress"
                  ? task.percentage || "50%"
                  : "0%"}
              </span>
            </div>
          </div>
        </div>

        {/* Assigned Users Section */}
        <div className="mt-8">
          <div className="flex items-center pb-2">
            <SectionHeader sectionKey="users" />
          </div>
          {task.assignedTo && task.assignedTo.length > 0 ? (
            <UserTable
              onViewUser={handleViewUser}
              users={task.assignedTo}
              px="4"
              py="4"
            />
          ) : (
            <p className="text-gray-500">No users assigned to this task</p>
          )}
        </div>
      </div>

      {/* Modals */}
      {isUpdateModalOpen && (
        <UpdateTask
          closeUpdateTask={closeUpdateModal}
          onUpdateTask={handleUpdateTask}
          taskToUpdate={task}
          projectUsers={project?.students || []}
        />
      )}
      {isDeleteModalOpen && (
        <DeleteTask closeDeleteTask={closeDeleteModal} task={task} />
      )}

      {/* Add DeleteTask modal component similarly */}
    </div>
  );
};

export default TaskDetailPage;
