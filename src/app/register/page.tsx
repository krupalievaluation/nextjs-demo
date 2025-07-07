"use client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/navigation";

// Yup validation schema
const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required")
});

export default function RegisterPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data: { email: string; password: string }) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" }
    });

    if (res) {
      router.push("/login");
    } else {
      alert("User already exists or an error occurred");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow p-6 rounded w-full max-w-sm space-y-4"
      >
        <h2 className="text-xl text-gray-800 font-bold text-center">
          Register
        </h2>

        <div>
          <input
            className={`w-full px-3 text-gray-800 py-2 border rounded ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Email"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <input
            type="password"
            className={`w-full px-3 text-gray-800 py-2 border rounded ${
              errors.password ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Password"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Register
        </button>
      </form>
    </div>
  );
}
