import React, { useContext, useState } from "react";
import assets from "../assets/assets";
import { AuthContext } from "../../context/AuthProvider";

const LoginPage = () => {
  const [currentState, setCurrentState] = useState("Sign Up");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useContext(AuthContext);
  const handelSubmit = (event) => {
    event.preventDefault();
    login(currentState === "Sign Up" ? "signup" : "login", {
      fullName,
      email,
      password,
    });
  };
  return (
    <div
      className="min-h-screen  flex items-center justify-center gap-8 sm:justify-evenly 
    max-sm:flex-col bg-gradient-to-r from-violet-950 via-black-100 to-black-800 h-screen w-full px-10"
    >
      {/* left */}
      <img src={assets.loginpage} alt="Logo" className="w-[min(50vw,450px)]" />
      {/* right */}
      <form
        onSubmit={handelSubmit}
        action=""
        className="border-2 text-white  border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg px-10 w-full md:w-[100%] lg:w-[40%] "
      >
        <h2 className="font-medium text-2xl flex justify-between items-center">
          {currentState}
        </h2>
        {currentState === "Sign Up" && (
          <input
            type="text"
            onChange={(e) => setFullName(e.target.value)}
            value={fullName}
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-1
              focus:ring-indigo-500"
            placeholder="Full Name"
            required
          />
        )}

          <>
            <input
              type="email"
              placeholder="Email Address"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
              className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-1
        focus:ring-indigo-500"
            />
            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
              className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </>

        <button
          type="submit"
          className="py-3 text-white rounded-md cursor-pointer bg-purple-500 "
        >
          {currentState === "Sign Up" ? "Create Account" : "Login Now"}
        </button>

        <div className="flex flex-col gap-2">
          {currentState === "Sign Up" ? (
            <p className="text-sm text-white">
              Already have an account ?
              <span
                className="ml-1 font-medium text-purple-500 cursor-pointer hover:border-b-2"
                onClick={() => {
                  setCurrentState("Login");
                }}
              >
                Login
              </span>
            </p>
          ) : (
            <p className="text-sm text-white">
              Create an account ?
              <span
                className="ml-1 font-medium text-purple-500 cursor-pointer hover:border-b-2"
                onClick={() => {
                  setCurrentState("Sign Up");
                  // setIsDataSubmitted(false)
                }}
              >
                Sign up{" "}
              </span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
