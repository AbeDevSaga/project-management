"use client";
import ActionButton from "@/app/components/ActionButton";
import SectionHeader from "@/app/components/SectionHeader";
import { TProject } from "@/app/constants/type";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/app/redux/store";
import {
  createProject,
  fetchAllProjects,
} from "@/app/redux/slices/projectSlice";
import ProjectCard from "@/app/components/project_related/ProjectCard";
import AddProject from "@/app/components/project_related/AddProject";
import { useRouter } from "next/navigation";
import { fetchAllUsers } from "@/app/redux/slices/userSlice";

function Projects() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
    const users = useSelector((state: RootState) => state.user.users);
  const projectList = useSelector(
    (state: RootState) => state.project.projects
  );
  const user = useSelector(
    (state: RootState) => state.auth.user);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Fetch projects on component mount
  useEffect(() => {
    dispatch(fetchAllProjects());
    dispatch(fetchAllUsers());
  }, [dispatch]);

  // Open the modals
  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  // Handle modal actions
  const handleAddProject = async (formData: FormData) => {
    const resultAction = await dispatch(createProject(formData));
    if (createProject.fulfilled.match(resultAction)) {
      console.log("Project added successfully:", resultAction.payload);
      dispatch(fetchAllProjects())
      setIsAddModalOpen(false);
    } else {
      console.error("Failed to add Project:", resultAction.payload);
    }
  };

  // Close the modals
  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  // Handle card click to navigate to project details
  const handleCardClick = (project: TProject) => {
    router.push(`projects/${project._id}`);
  };

  return (
    <div className="w-full h-full pb-2 relative mx-auto px-4 overflow-auto scrollbar-hide">
      <div className="flex items-center pb-2">
        <SectionHeader sectionKey="projects" />
        {user?.role === "student" && (<div className="w-auto">
          <ActionButton
            label="Create Project"
            onClick={openAddModal}
            icon="project"
          />
        </div>)}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projectList.map((project, index) => (
          <div key={index} className="self-start">
            <ProjectCard
              project={project}
              onCardClick={() => handleCardClick(project)}
            />
          </div>
        ))}
      </div>
      {isAddModalOpen && (
        <AddProject
          users={users}
          closeAddProject={closeAddModal}
          onAddProject={handleAddProject}
        />
      )}
    </div>
  );
}

export default Projects;