"use client";
import { TUser } from "@/app/constants/type";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/redux/store";
import { fetchAllProjects } from "@/app/redux/slices/projectSlice";
import { useRouter } from "next/navigation";
import UserTable from "@/app/components/user_related/UsersTable";

function Teams() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { projects } = useSelector((state: RootState) => state.project);
  const [students, setStudents] = useState<TUser[]>([]);

  // Fetch projects on component mount
  useEffect(() => {
    dispatch(fetchAllProjects());
  }, [dispatch]);

  useEffect(() => {
    if (projects && projects.length > 0) {
      const allStudents = projects
        .flatMap(project => project.students || [])
        .filter((student, index, self) =>
          student?._id && index === self.findIndex(s => s?._id === student._id)
        ) as TUser[];
      setStudents(allStudents);
    }
  }, [projects]);

  const handleViewUser = (user: TUser) => {
    router.push(`students/${user._id}`);
  };

  return (
    <div className="w-full h-full pb-2 relative mx-auto px-4 overflow-auto scrollbar-hide">
      <UserTable 
        onViewUser={handleViewUser} 
        users={students} 
        px="4" 
        py="4" 
      />
    </div>
  );
}

export default Teams;