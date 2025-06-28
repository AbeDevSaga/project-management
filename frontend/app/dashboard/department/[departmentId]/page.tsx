"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { TDepartment, TUser, TProject } from "@/app/constants/type";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/redux/store";
import {
  fetchDepartmentById,
  updateDepartment,
  deleteDepartment,
  addUsersToDepartment,
  //   addHeadToDepartment,
  //   addAdvisorToDepartment,
  //   addStudentToDepartment,
} from "@/app/redux/slices/deptSlice";
import {
  fetchAllUsers,
  fetchUsersByDepartmentId,
} from "@/app/redux/slices/userSlice";
import { toast } from "react-toastify";
import SectionHeader from "@/app/components/SectionHeader";
import ActionButton from "@/app/components/ActionButton";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useRouter } from "next/navigation";
import UserTable from "@/app/components/user_related/UsersTable";
import Alert from "@/app/components/AlertProp";
import UpdateDepartment from "@/app/components/dept_related/UpdateDepartment";
import AddUsers from "@/app/components/dept_related/AddUsers";

const DepartmentDetailPage = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const users = useSelector((state: RootState) => state.user.users);
  const potentialHeads = users.filter((user) => user.role === "departmentHead");
  console.log("potential heads", potentialHeads, "users: ", users);
  const { departmentId } = useParams() as { departmentId: string };

  const [students, setStudents] = useState<TUser[]>([]);
  const [advisors, setAdvisors] = useState<TUser[]>([]);

  const [department, setDepartment] = useState<TDepartment | null>(null);
  const [departmentUsers, setDepartmentUsers] = useState<TUser[]>([]);
  const [departmentProjects, setDepartmentProjects] = useState<TProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [showActions, setShowActions] = useState(false);
  const [addHeadModalOpen, setAddHeadModalOpen] = useState(false);
  const [addAdvisorModalOpen, setAddAdvisorModalOpen] = useState(false);
  const [addStudentModalOpen, setAddStudentModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] =
    useState<TDepartment | null>(null);
  const [alert, setAlert] = useState<{
    status: "success" | "error";
    text: string;
  } | null>(null);

  // Open modals
  const openAddHeadModal = () => setAddHeadModalOpen(true);
  const openAddAdvisorModal = () => setAddAdvisorModalOpen(true);
  const openAddStudentModal = () => setAddStudentModalOpen(true);
  const openUpdateModal = (dept: TDepartment) => {
    setIsUpdateModalOpen(true);
    setSelectedDepartment(dept);
  };
  const openDeleteModal = (dept: TDepartment) => {
    setSelectedDepartment(dept);
    setIsDeleteModalOpen(true);
  };

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const handleAddUsers = (userIds: string[], deptId: string, role: string) => {
    dispatch(addUsersToDepartment({ departmentId: deptId, userIds, role }))
      .unwrap()
      .then(() => {
        toast.success(`${role}s added successfully`);
      })
      .catch((error) => {
        toast.error(`Failed to add ${role}s: ${error}`);
      });
  };

  const handleUpdateDepartment = async (updatedDept: TDepartment) => {
    try {
      const result = await dispatch(
        updateDepartment({
          id: departmentId,
          departmentData: updatedDept,
        })
      ).unwrap();

      setDepartment(result);
      setAlert({ status: "success", text: "Department updated successfully" });
      setIsUpdateModalOpen(false);
    } catch (error) {
      setAlert({ status: "error", text: "Failed to update department" });
    }
  };

  const handleDeleteDepartment = async () => {
    try {
      await dispatch(deleteDepartment(departmentId)).unwrap();
      setAlert({ status: "success", text: "Department deleted successfully" });
      router.push("/departments");
    } catch (error) {
      setAlert({ status: "error", text: "Failed to delete department" });
    }
  };

  const handleViewUser = (user: TUser) => {
    router.push(`/users/${user._id}`);
  };

  const handleViewProject = (project: TProject) => {
    router.push(`/projects/${project._id}`);
  };

  // Close modals
  const closeAddHeadModal = () => setAddHeadModalOpen(false);
  const closeAddAdvisorModal = () => setAddAdvisorModalOpen(false);
  const closeAddStudentModal = () => setAddStudentModalOpen(false);
  const closeUpdateModal = () => setIsUpdateModalOpen(false);
  const closeDeleteModal = () => setIsDeleteModalOpen(false);

  // Fetch data
  const fetchDepartmentData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch department details
      const deptResponse = await dispatch(fetchDepartmentById(departmentId));
      if (fetchDepartmentById.fulfilled.match(deptResponse)) {
        setDepartment(deptResponse.payload);
        setStudents(deptResponse.payload.students || []);
        setAdvisors(deptResponse.payload.advisors || []);
        console.log("Department data:", deptResponse.payload);

        // Fetch department users
        const usersResponse = await dispatch(
          fetchUsersByDepartmentId(departmentId)
        );
        if (fetchUsersByDepartmentId.fulfilled.match(usersResponse)) {
          setDepartmentUsers(usersResponse.payload);
        }
      } else {
        setError("Failed to fetch department data");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartmentData();
  }, [dispatch, departmentId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!department) return <div>Department not found</div>;

  return (
    <div className="w-full h-full relative space-y-4 mx-auto overflow-auto scrollbar-hide">
      {/* Department Headear */}
      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="absolute top-2 right-2">
          <BsThreeDotsVertical
            onClick={() => setShowActions(!showActions)}
            className="text-gray-600 cursor-pointer"
          />
        </div>

        {showActions && (
          <div className="absolute bg-white py-2 top-10 right-2 rounded-lg shadow-md">
            <div
              onClick={() => openUpdateModal(department)}
              className="right-2 bg-white px-4 pb-2 cursor-pointer hover:text-primary duration-300"
            >
              Update Department
            </div>
            <div
              onClick={() => openDeleteModal(department)}
              className="right-2 bg-white px-4 cursor-pointer border-t border-gray-200 pt-2 hover:text-red-500 duration-300"
            >
              Delete Department
            </div>
          </div>
        )}

        {/* Department Name and Description */}
        <div className="flex items-center space-x-4 mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            {department.name}
          </h1>
        </div>

        {/* Department Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Department Head */}
          {department.head ? (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-sm font-semibold text-gray-500">
                Department Head
              </h2>
              <p className="text-gray-800">{department.head.username}</p>
            </div>
          ) : (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-sm font-semibold text-red-400">Head ?</h2>
              <p
                onClick={openAddHeadModal}
                className="text-blue-500 cursor-pointer hover:text-blue-700"
              >
                Assign Head +
              </p>
            </div>
          )}

          {/* Advisors Count */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-sm font-semibold text-gray-500">Advisors</h2>
            <p className="text-gray-800">{department.advisors?.length || 0}</p>
          </div>

          {/* Evaluators Count */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-sm font-semibold text-gray-500">Evaluators</h2>
            <p className="text-gray-800">
              {department.evaluators?.length || 0}
            </p>
          </div>

          {/* Students Count */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-sm font-semibold text-gray-500">Students</h2>
            <p className="text-gray-800">{department.students?.length || 0}</p>
          </div>

          {/* Projects Count */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-sm font-semibold text-gray-500">Projects</h2>
            <p className="text-gray-800">{department.projects?.length}</p>
          </div>
        </div>
      </div>

       {/* Head Section */}
      <div className="px-6 py-2 w-full h-full overflow-hidden relative bg-white rounded-lg shadow-md">
        {/* Head Section */}
        {department.head && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Department Head</h3>
            <UserTable
              users={[department.head]}
              onViewUser={handleViewUser}
              px="4"
              py="4"
            />
          </div>
        )}
      </div>
      {/* Advisors Section */}
      <div className="px-6 py-2 w-full h-full overflow-hidden relative bg-white rounded-lg shadow-md">
        <div className="flex items-center pb-2">
          <SectionHeader sectionKey="users" />
          <div className="flex space-x-2 ml-auto">
            <ActionButton
              label="Add Advisor"
              onClick={openAddAdvisorModal}
              icon="add_user"
            />
          </div>
        </div>

        {/* Advisors Section */}
        {department.advisors && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Advisors</h3>
            <UserTable
              users={advisors}
              onViewUser={handleViewUser}
              px="4"
              py="4"
            />
          </div>
        )}
      </div>
      {/* Students Section */}
      <div className="px-6 py-2 w-full h-full overflow-hidden relative bg-white rounded-lg shadow-md">
        {department.students && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Students</h3>
            <UserTable
              users={students}
              onViewUser={handleViewUser}
              px="4"
              py="4"
            />
          </div>
        )}
      </div>

      {/* Modals */}
      {addHeadModalOpen && (
        <AddUsers
          role="departmentHead"
          departmentId={departmentId}
          users={potentialHeads}
          closeAddUsers={closeAddHeadModal}
          onAddUsers={handleAddUsers}
        />
      )}
      {addAdvisorModalOpen && (
        <AddUsers
          role="advisors"
          departmentId={departmentId}
          users={departmentUsers}
          closeAddUsers={closeAddAdvisorModal}
          onAddUsers={handleAddUsers}
        />
      )}

      {isUpdateModalOpen && selectedDepartment && (
        <UpdateDepartment
          closeUpdateDepartment={closeUpdateModal}
          onUpdateDepartment={handleUpdateDepartment}
          departmentToUpdate={selectedDepartment}
        />
      )}

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

export default DepartmentDetailPage;
