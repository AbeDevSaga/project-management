"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "@/app/redux/slices/authSlice"; // Import the registerUser action
import { AppDispatch, RootState } from "@/app/redux/store"; // Import RootState

const SignUpPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch<AppDispatch>(); 
  const router = useRouter();
  const { loading, error } = useSelector((state: RootState) => state.auth); // Get loading and error state

  const handleRegister = async () => {
    const resultAction = await dispatch(registerUser({ username, email, password })); // Dispatch registerUser action
    if (registerUser.fulfilled.match(resultAction)) {
      alert("Registration successful! Please login."); // Show success message
      router.push("/auth/login"); // Redirect to login page
    } else {
      alert("Registration failed"); // Show error message
    }
  };

  return (
    <div className="h-screen text-gray-900 flex flex-col justify-center items-center">
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
        disabled={loading} // Disable button while loading
        className="px-4 py-2 bg-green-500 text-white rounded-md disabled:bg-green-300"
      >
        {loading ? "Registering..." : "Sign Up"}
      </button>
      {error && <p className="mt-4 text-red-500">{error}</p>} {/* Show error message */}
    </div>
  );
};

export default SignUpPage;