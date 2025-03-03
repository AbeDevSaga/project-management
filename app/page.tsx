"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { checkAuth } from "./api/auth";
import { useAuthStore } from "./utils/authStore";

const LandingPage: React.FC = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const router = useRouter();
  console.log("isAuthenticated", isAuthenticated);

  useEffect(() => {
    if (checkAuth() || isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold mb-6">Welcome to Code Collab</h1>
      <p className="mb-4">Select an option to get started:</p>
      <div className="flex space-x-4">
        <button
          onClick={() => router.push("/authentication/login")}
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Login
        </button>
        <button
          onClick={() => router.push("/authentication/signup")}
          className="px-4 py-2 bg-green-500 text-white rounded-md"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
