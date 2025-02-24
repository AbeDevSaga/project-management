import React from "react";

function FloatingLabel() {
  return (
    <div className="relative mt-4">
      <input
        type="email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary peer"
        placeholder=" "
      />
      <label
        htmlFor="email"
        className="absolute left-2 top-2 px-1 text-gray-500 bg-white transition-all duration-200 peer-focus:-top-2 peer-focus:text-sm peer-focus:text-primary peer-placeholder-shown:top-2 peer-placeholder-shown:text-base"
      >
        Email
      </label>
    </div>
  );
}

export default FloatingLabel;
