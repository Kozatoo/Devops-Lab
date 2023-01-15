import { useState } from "react";
import { useAuth } from "../Context/AuthProvider";
export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { Register } = useAuth();
  return (
    <div className="relative flex flex-col justify-center min-h-screen overflow-hidden">
      <div className="w-full p-6 m-auto bg-white rounded-md shadow-md lg:max-w-xl">
        <h1 className="text-3xl font-semibold text-center text-purple-700 underline">
          Sign up
        </h1>
        <form
          className="mt-6"
          onSubmit={(e) => {
            e.preventDefault();
            const data = { username, password };
            console.log({ data });
            Register(data);
          }}
        >
          <div className="mb-2">
            <label
              htmlFor="username"
              className="block text-sm font-semibold text-gray-800"
            >
              username
            </label>
            <input
              value={username}
              required
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              type="text"
              className="block w-full px-4 py-2 mt-2 text-purple-700 bg-white border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
            />
          </div>
          <div className="mb-2">
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-800"
            >
              Password
            </label>
            <input
              value={password}
              required
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              type="password"
              className="block w-full px-4 py-2 mt-2 text-purple-700 bg-white border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
            />
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-purple-700 rounded-md hover:bg-purple-600 focus:outline-none focus:bg-purple-600"
            >
              Register
            </button>
          </div>
        </form>

        <p className="mt-8 text-xs font-light text-center text-gray-700">
          {" "}
          Don't have an account?{" "}
          <a
            href="/signup"
            className="font-medium text-purple-600 hover:underline"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
