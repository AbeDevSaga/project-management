"use client";
import React, { useState } from "react";
import Pagination from "../Pagination";
import DeleteUser from "./DeleteUser";
import { UserActions } from "./UserActions";
import { TUser } from "@/app/constants/type";
import { formatDate } from "@/app/utils/dateUtils";

interface UserTableProps {
  onViewUser: (userData: TUser) => void;
  users: TUser[]; // Define the users prop
  px: string,
  py: string,
}

const UserTable : React.FC<UserTableProps> = ({ onViewUser, users, px, py }) => {
  const [deletedUser, setDeletedUser] = useState<TUser | null>(null); // State to track the deleted user
  const [currentPage, setCurrentPage] = useState(1); // State to track the current page
  const usersPerPage = 6; // Number of users to display per page

  // Function to handle view action
  const handleView = (user: TUser) => {
    onViewUser(user); // Call the onViewUser prop function
  };

  // Function to handle delete action
  const handleDelete = (user: TUser) => {
    setDeletedUser(user); // Set the deleted user
  };

  // Function to close the DeleteUser modal
  const closeDeleteUser = () => {
    setDeletedUser(null); // Clear the deleted user
  };

  // Calculate the users to display on the current page
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  // Function to change the page
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Function to go to the next page
  const nextPage = () => {
    if (currentPage < Math.ceil(users.length / usersPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Function to go to the previous page
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="min-h-screen">
      {deletedUser && (
        <DeleteUser user={deletedUser} closeDeleteUser={closeDeleteUser} />
      )}

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          {/* Table Header */}
          <thead className="bg-sidebarcolor">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Name
              </th>
              <th className="hidden sm:table-cell px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Email
              </th>
              <th className="hidden md:table-cell px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Phone
              </th>
              <th className="hidden lg:table-cell px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Date
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider">
                Quick Action
              </th>
            </tr>
          </thead>
          {/* Table Body */}
          <tbody className="bg-white divide-y divide-gray-200">
            {currentUsers.map((user) => (
              <tr key={user._id}>
                <td className={`px-${px} py-${py} whitespace-nowrap text-sm`}>
                  {user.username}
                </td>
                <td className={`hidden sm:table-cell px-${px} py-${py} whitespace-nowrap text-sm`}>
                  {user.email}
                </td>
                <td className={`hidden md:table-cell px-${px} py-${py} whitespace-nowrap text-sm`}>
                  {user.phone}
                </td>
                <td className={`hidden lg:table-cell px-${px} py-${py} whitespace-nowrap text-sm`}>
                  {user.created_at && formatDate(user.created_at)}
                </td>
                <td className="px-6 py-4 flex items-center justify-center whitespace-nowrap text-sm">
                  <UserActions
                    user={user}
                    onView={handleView} // Pass the handleView function
                    onDelete={handleDelete} // Pass the handleDelete function
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination Component */}
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(users.length / usersPerPage)}
        onPageChange={paginate}
        onNextPage={nextPage}
        onPrevPage={prevPage}
      />
    </div>
  );
};

export default UserTable;