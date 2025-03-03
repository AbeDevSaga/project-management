"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/app/api/auth";
import { useAuthStore } from "@/app/utils/authStore";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const router = useRouter();

  const handleLogin = async () => {
    const success = await loginUser(email, password);
    console.log("sucess: ", success)
    if (success) {
      router.push("/dashboard");
    } else {
      alert("Login failed");
    }
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold mb-6">Login to Code Collab</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded-md"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded-md"
      />
      <button
        onClick={handleLogin}
        className="px-4 py-2 bg-blue-500 text-white rounded-md"
      >
        Login
      </button>
      <p className="mt-4">
        Don't have an account?{" "}
        <span
          onClick={() => router.push("/authentication/signup")}
          className="text-blue-600 cursor-pointer"
        >
          Sign Up
        </span>
      </p>
    </div>
  );
};

export default LoginPage;
