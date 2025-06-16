import axios from "axios";
import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { AuthContext } from "../AuthContext";

export default function LoginForm() {
  const { setIsLoggedIn } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange" });
  const navigate = useNavigate();
  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/login`,
        {
          email: data.email,
          password: data.password,
        }
      );

      const token = response.data.token;
      localStorage.setItem("token", token); // Store token for protected requests
      localStorage.setItem("email", data.email);
      navigate("/");
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      alert("Login failed: " + (error.response?.data?.message || "Try again"));
    }
  };

  return (
    <div className="w-[80%] mt-4 border-t-1 ">
      <h2 className="text-center font-bold mt-2">Login</h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 p-4 rounded-lg shadow"
      >
        <div>
          <label htmlFor="emailLogin" className="mb-1 font-medium">
            Email
          </label>
          <input
            id="emailLogin"
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: "Invalid email format",
              },
            })}
            className="input input-bordered w-full"
            placeholder="Enter your email"
          />
          {errors.email && (
            <p className="text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="passwordLogin" className="mb-1 font-medium">
            Password
          </label>
          <input
            id="passwordLogin"
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            className="input input-bordered w-full"
            placeholder="Enter your password"
          />
          {errors.password && (
            <p className="text-red-500">{errors.password.message}</p>
          )}
        </div>

        <button type="submit" className="btn btn-primary w-fit">
          Login
        </button>
      </form>
    </div>
  );
}
