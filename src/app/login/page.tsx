"use client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Yup validation schema
const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required")
});

export default function LoginPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data: { email: string; password: string }) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" }
    });

    const result = await res.json();
    if (res) {
      localStorage.setItem("token", result.token);
      router.push("/feedbacks/list");
    } else {
      alert(result.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm bg-white p-8 rounded shadow-md space-y-6"
      >
        <h2 className="text-2xl text-gray-800 font-bold text-center">
          Admin Login
        </h2>

        <div>
          <label className="block text-gray-800 text-sm font-medium mb-1">
            Email
          </label>
          <Input
            type="email"
            {...register("email")}
            className={`w-full px-4 text-gray-800 py-2 border rounded ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter your email"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-800 text-sm font-medium mb-1">
            Password
          </label>
          <Input
            type="password"
            {...register("password")}
            className={`w-full px-4 text-gray-800 py-2 border rounded ${
              errors.password ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter your password"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          Login
        </Button>
      </form>
    </div>
  );
}
