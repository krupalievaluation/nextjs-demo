"use client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useState } from "react";
import Spinner from "../component/spinner";

// Yup validation schema
const schema = yup.object().shape({
  email: yup.string().email("invalidEmail").required("emailRequired"),
  password: yup.string().required("passwordRequired")
});

export default function LoginPage() {
  const router = useRouter();
  const tl = useTranslations("login");
  const tc = useTranslations("common");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data: { email: string; password: string }) => {
    setLoading(true);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" }
    });

    const result = await res.json();
    if (result.token) {
      localStorage.setItem("token", result.token);
      router.push("/feedbacks/list");
    } else {
      alert(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center h-full bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm bg-white p-8 rounded shadow-md space-y-6"
      >
        <h2 className="text-2xl text-gray-800 font-bold text-center">
          {tl("title")}
        </h2>

        <div>
          <label className="block text-gray-800 text-sm font-medium mb-1">
            {tl("emailLabel")}
          </label>
          <Input
            type="email"
            {...register("email")}
            className={`w-full px-4 text-gray-800 py-2 border rounded ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
            placeholder={tl("emailPlaceholder")}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">
              {tc(errors.email.message || "emailRequired")}
            </p>
          )}
        </div>

        <div>
          <label className="block text-gray-800 text-sm font-medium mb-1">
            {tl("passwordLabel")}
          </label>
          <Input
            type="password"
            {...register("password")}
            className={`w-full px-4 text-gray-800 py-2 border rounded ${
              errors.password ? "border-red-500" : "border-gray-300"
            }`}
            placeholder={tl("passwordPlaceholder")}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {tl(errors.password.message || "passwordRequired")}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 text-[16px] rounded hover:bg-blue-700 transition "
        >
          {loading && <Spinner size={1} color="white" />}
          {tl("login")}
        </Button>
      </form>
    </div>
  );
}
