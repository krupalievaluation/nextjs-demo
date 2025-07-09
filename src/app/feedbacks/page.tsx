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
import { useTranslations } from "next-intl";
import Spinner from "../component/spinner";

export default function FeedbackForm() {
  // const locale = useLocale();
  const [isAnonymous, setIsAnonymous] = useState(false);
  const tf = useTranslations("feedback");
  const tc = useTranslations("common");
  const [loading, setLoading] = useState(false);
  const schema = yup.object().shape({
    name: isAnonymous
      ? yup.string().optional()
      : yup.string().required("nameRequired"),
    email: isAnonymous
      ? yup.string().email("invalidEmail").optional()
      : yup.string().email("invalidEmail").required("emailRequired"),
    message: yup.string().required("messageRequired")
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
    setLoading(true);
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
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center h-full bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow p-6 rounded w-full max-w-md space-y-5"
      >
        <h2 className="text-xl text-gray-800 font-bold">
          {tf("submitFeedback")}
        </h2>
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">
            {tf("submitAnonymously")}
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
            placeholder={tc("name")}
            {...register("name", {
              required: !isAnonymous ? tc("nameRequired") : false
            })}
            disabled={isAnonymous}
          />
          {!isAnonymous && errors.name && (
            <p className="text-red-500 text-sm">
              {tc(errors.name.message || "nameRequired")}
            </p>
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
            placeholder={tc("email")}
            {...register("email", {
              required: !isAnonymous ? tc("emailRequired") : false,
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: tc("invalidEmail")
              }
            })}
            disabled={isAnonymous}
          />
          {!isAnonymous && errors.email && (
            <p className="text-red-500 text-sm mt-1">
              {tc(errors.email.message || "emailRequired")}
            </p>
          )}
        </div>

        <div>
          <Textarea
            rows={4}
            className={`w-full px-3 py-2 text-gray-800 border rounded ${
              errors.message ? "border-red-500" : "border-gray-300"
            }`}
            placeholder={tf("feedback")}
            {...register("message")}
          />
          {errors.message && (
            <p className="text-red-500 text-sm">
              {tf(errors.message.message || "messageRequired")}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full py-2 rounded">
          {loading && <Spinner size={1} color="white" />} {tf("submit")}
        </Button>
      </form>
    </div>
  );
}
