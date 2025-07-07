import { NextResponse } from "next/server";
import Feedback from "@/app/model/feedback";
export async function GET(request: Request) {
  //   await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "5");
    const skip = (page - 1) * limit;

    const [feedbackList, total] = await Promise.all([
      Feedback.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
      Feedback.countDocuments()
    ]);

    return NextResponse.json(
      {
        message: "Feedback retrieved successfully",
        feedbackList,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalFeedbacks: total
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { message: "Failed to retrieve feedback", error: err },
      { status: 500 }
    );
  }
}
export async function POST(request: Request) {
  const { email, name, message } = await request.json();

  if (!message) {
    return NextResponse.json(
      { message: "Message are required" },
      { status: 400 }
    );
  }

  const feedback = await Feedback.create({ email, name, message });

  return NextResponse.json(
    { message: "Feedback added successfully", feedback },
    { status: 201 }
  );
}
