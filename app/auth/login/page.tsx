"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/app/redux/store"; 
import { loginUser } from "@/app/redux/slices/authSlice"; 
import { RootState } from "@/app/redux/store";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch<AppDispatch>(); // Type the dispatch function
  const router = useRouter();
  const { loading, error } = useSelector((state: RootState) => state.auth); // Get loading and error state

  const handleLogin = async () => {
    const resultAction = dispatch(loginUser({ email, password })); // Dispatch loginUser action
    if (loginUser.fulfilled.match(resultAction)) {
      router.push("/dashboard"); // Redirect to dashboard on successful login
    } else {
      alert("Login failed"); // Show error message
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
        disabled={loading} // Disable button while loading
        className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-blue-300"
      >
        {loading ? "Logging in..." : "Login"}
      </button>
      {error && <p className="mt-4 text-red-500">{error}</p>} {/* Show error message */}
      <p className="mt-4">
        Don't have an account?{" "}
        <span
          onClick={() => router.push("/auth/signup")}
          className="text-blue-600 cursor-pointer"
        >
          Sign Up
        </span>
      </p>
    </div>
  );
};

export default LoginPage;