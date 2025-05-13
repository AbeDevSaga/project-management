"use client";
import React, { useEffect, useState } from "react";
import ActionButton from "../ActionButton";
import { TUser } from "@/app/constants/type";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsers, selectStudents, selectDepartmentHeads } from "@/app/redux/slices/userSlice";
import { AppDispatch, RootState } from "@/app/redux/store";

interface AddUsersProps {
  users: TUser[]; // List of all users
  departmentId: string; // ID of the department to add users to
  role: string; // Role of users to add ('advisor', 'student', etc.)
  closeAddUsers: () => void; // Callback to close the modal
  onAddUsers: (userIds: string[], departmentId: string, role: string) => void; // Callback to add users
}

const AddUsers: React.FC<AddUsersProps> = ({
  users,
  departmentId,
  role,
  closeAddUsers,
  onAddUsers,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const students = useSelector(selectStudents);
  const departmentHeads = useSelector(selectDepartmentHeads);
  const allUsers = useSelector((state: RootState) => state.user.users);

  useEffect(() => {
    setIsLoading(true);
    dispatch(fetchAllUsers()).finally(() => setIsLoading(false));
  }, [dispatch]);

  // Filter users based on role
  const getFilteredUsers = () => {
    if (role === 'students') {
      return users.filter(user => 
        students && students.department !== departmentId
      );
    } else if (role === 'advisors') {
      return users.filter(user => 
        user.role !== 'student' && user.department !== departmentId
      );
    } else if (role === 'departmentHead') {
      // Use the freshly fetched department heads from Redux
      return departmentHeads.filter((user: TUser) => 
        user.department !== departmentId
      );
    }
    return [];
  };

  const filteredUsers = getFilteredUsers();

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleAddUsers = () => {
    if (selectedUsers.length === 0) {
      alert(`Please select at least one ${role}!`);
      return;
    }
    
    onAddUsers(selectedUsers, departmentId, role);
    closeAddUsers();
  };

  const getRoleDisplayName = () => {
    switch(role) {
      case 'advisor': return 'Advisor';
      case 'student': return 'Student';
      case 'departmentHead': return 'Department Head';
      default: return role;
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="relative p-6 bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <div className="absolute top-2 right-2">
          <button
            onClick={closeAddUsers}
            className="flex text-2xl items-center justify-center w-6 h-6 rounded-full shadow-xl text-red-500 hover:text-red-700 bg-white"
          >
            &times;
          </button>
        </div>

        {/* Header */}
        <div className="flex items-center justify-center mb-6">
          <h2 className="text-primary text-xl font-semibold">
            Add {getRoleDisplayName()}s to Department
          </h2>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}

        {/* User List */}
        {!isLoading && (
          <div className="space-y-3">
            {filteredUsers.length === 0 ? (
              <p className="text-center text-gray-500">No {getRoleDisplayName()}s available</p>
            ) : (
              filteredUsers.map(user => (
                <div 
                  key={user._id} 
                  className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => toggleUserSelection(user._id!)}
                >
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user._id!)}
                    onChange={() => toggleUserSelection(user._id!)}
                    className="mr-3 h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{user.username}</h3>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    {user.department && (
                      <p className="text-xs text-gray-500">
                        Currently in: {typeof user.department === 'object' ? user.department.name : user.department}
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Selected Count */}
        {selectedUsers.length > 0 && (
          <div className="mt-4 text-sm text-gray-600">
            {selectedUsers.length} {getRoleDisplayName()}(s) selected
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex justify-between">
          <button
            onClick={closeAddUsers}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <ActionButton
            label={`Add ${selectedUsers.length} ${getRoleDisplayName()}s`}
            icon="add_user"
            onClick={handleAddUsers}
          />
        </div>
      </div>
    </div>
  );
};

export default AddUsers;