"use client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";

export default function FeedbackForm() {
  const [isAnonymous, setIsAnonymous] = useState(false);

  // Yup schema: only `message` is required
  const schema = yup.object().shape({
    name: isAnonymous
      ? yup.string().optional()
      : yup.string().required("Name is required"),
    email: isAnonymous
      ? yup.string().email("Invalid email").optional()
      : yup.string().email("Invalid email").required("Email is required"),
    message: yup.string().required("Message is required")
  });
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    trigger,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data: {
    name?: string;
    email?: string;
    message: string;
  }) => {
    // const token = localStorage.getItem("token");
    // if (!token) {
    //   alert("Please login first!");
    //   return;
    // }

    const res = await fetch("/api/feedback", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (res.ok) {
      reset();
      toast.success("Feedback submitted!");
    } else {
      toast.error("Error submitting feedback");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow p-6 rounded w-full max-w-md space-y-5"
      >
        <h2 className="text-xl text-gray-800 font-bold">Submit Feedback</h2>
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">
            Submit Anonymously
          </label>
          <label className="relative inline-flex items-center cursor-pointer">
            <Switch
              checked={isAnonymous}
              onCheckedChange={(checked) => {
                setIsAnonymous(checked);
                setValue("name", "");
                setValue("email", "");

                trigger(["name", "email"]);
              }}
            />
          </label>
        </div>
        <div>
          <Input
            className={`w-full px-3 text-gray-800 py-2 border rounded ${
              !isAnonymous && errors.name ? "border-red-500" : "border-gray-300"
            }`}
            type="text"
            placeholder="Name (optional)"
            {...register("name", {
              required: !isAnonymous ? "Name is required" : false
            })}
            disabled={isAnonymous}
          />
          {!isAnonymous && errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        <div>
          <Input
            type="email"
            className={`w-full px-3 py-2 text-gray-800 border rounded ${
              !isAnonymous && errors.email
                ? "border-red-500"
                : "border-gray-300"
            }`}
            placeholder="Email"
            {...register("email", {
              required: !isAnonymous ? "Email is required" : false,
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email"
              }
            })}
            disabled={isAnonymous}
          />
          {!isAnonymous && errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <Textarea
            rows={4}
            className={`w-full px-3 py-2 text-gray-800 border rounded ${
              errors.message ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Your feedback..."
            {...register("message")}
          />
          {errors.message && (
            <p className="text-red-500 text-sm">{errors.message.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full py-2 rounded">
          Submit
        </Button>
      </form>
    </div>
  );
}
