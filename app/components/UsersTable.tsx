"use client";
import React, { useState } from "react";
import { users } from "../constants/usersList";
import { UserActions } from "./UserActions";
import ViewUser from "./ViewUser";
import DeleteUser from "./DeleteUser";
import Pagination from "./Pagination";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  date: string;
  status: string;
}

const UserTable = () => {
  const [viewedUser, setViewedUser] = useState<User | null>(null); // State to track the viewed user
  const [deletedUser, setDeletedUser] = useState<User | null>(null); // State to track the deleted user
  const [currentPage, setCurrentPage] = useState(1); // State to track the current page
  const usersPerPage = 11; // Number of users to display per page

  // Function to handle view action
  const handleView = (user: User) => {
    setViewedUser(user); // Set the viewed user
  };

  // Function to close the ViewUser modal
  const closeViewUser = () => {
    setViewedUser(null); // Clear the viewed user
  };

  // Function to handle delete action
  const handleDelete = (user: User) => {
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
      {/* Render the ViewUser component if a user is being viewed */}
      {viewedUser && (
        <ViewUser user={viewedUser} closeViewUser={closeViewUser} />
      )}
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
              <th className="hidden xl:table-cell px-4 py-3 text-center text-xs font-medium uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider">
                Quick Action
              </th>
            </tr>
          </thead>
          {/* Table Body */}
          <tbody className="bg-white divide-y divide-gray-200">
            {currentUsers.map((user) => (
              <tr key={user.id}>
                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  {user.name}
                </td>
                <td className="hidden sm:table-cell px-4 py-4 whitespace-nowrap text-sm">
                  {user.email}
                </td>
                <td className="hidden md:table-cell px-4 py-4 whitespace-nowrap text-sm">
                  {user.phone}
                </td>
                <td className="hidden lg:table-cell px-4 py-4 whitespace-nowrap text-sm">
                  {user.date}
                </td>
                <td className="hidden xl:table-cell px-2 py-2 whitespace-nowrap">
                  <span
                    className={`py-2 flex items-center justify-center text-xs font-semibold rounded-lg ${
                      user.status === "active"
                        ? "bg-green-100 text-green-800"
                        : user.status === "inactive"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {user.status}
                  </span>
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