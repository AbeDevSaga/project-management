"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/app/api/auth";

const SignUpPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleRegister = async () => {
    const success = await registerUser(username, email, password);
    if (success) {
      alert("Registration successful! Please login.");
      router.push("/authentication/login");
    } else {
      alert("Registration failed");
    }
  };

  return (
    <div className="h-screen text-gray-900  flex flex-col justify-center items-center">
      <h1 className="text-4xl text-white font-bold mb-6">Create an Account</h1>
      <input
        type="text"
        placeholder="User Name"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded-md"
      />
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
        onClick={handleRegister}
        className="px-4 py-2 bg-green-500 text-white rounded-md"
      >
        Sign Up
      </button>
    </div>
  );
};

export default SignUpPage;
