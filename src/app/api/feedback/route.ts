import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET as string;
export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.split(" ")[1]; // Expecting: Bearer <token>

    if (!token) {
      return NextResponse.json({ message: "Token missing" }, { status: 401 });
    }

    // 🔐 Step 2: Verify token
    try {
      jwt.verify(token, JWT_SECRET);
    } catch (error) {
      console.error(error);
      return NextResponse.json({ message: "Invalid token" }, { status: 403 });
    }
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "5");
    const date = searchParams.get("date");
    const skip = (page - 1) * limit;
    // Calculate start and end of the day (if date is provided)
    let dateFilter = undefined;

    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);

      const end = new Date(date);
      end.setHours(23, 59, 59, 999);

      dateFilter = {
        createdAt: {
          gte: start,
          lte: end
        }
      };
    }

    const [feedbackList, total] = await Promise.all([
      prisma.feedback.findMany({
        where: dateFilter,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" }
      }),
      prisma.feedback.count({ where: dateFilter })
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
  try {
    const { email, name, message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { message: "Message is required" },
        { status: 400 }
      );
    }
    const feedback = await prisma.feedback.create({
      data: { email: email ?? null, name: name ?? null, message }
    });
    return NextResponse.json(
      { message: "Feedback added successfully", feedback },
      { status: 201 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "Failed to add feedback", error: err },
      { status: 500 }
    );
  }
}

// import { NextResponse } from "next/server";
// import Feedback from "@/app/model/feedback";
// export async function GET(request: Request) {
//   //   await dbConnect();
//   try {
//     const { searchParams } = new URL(request.url);
//     const page = parseInt(searchParams.get("page") || "1");
//     const limit = parseInt(searchParams.get("limit") || "5");
//     const skip = (page - 1) * limit;

//     const [feedbackList, total] = await Promise.all([
//       Feedback.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
//       Feedback.countDocuments()
//     ]);

//     return NextResponse.json(
//       {
//         message: "Feedback retrieved successfully",
//         feedbackList,
//         currentPage: page,
//         totalPages: Math.ceil(total / limit),
//         totalFeedbacks: total
//       },
//       { status: 200 }
//     );
//   } catch (err) {
//     return NextResponse.json(
//       { message: "Failed to retrieve feedback", error: err },
//       { status: 500 }
//     );
//   }
// }
// export async function POST(request: Request) {
//   const { email, name, message } = await request.json();

//   if (!message) {
//     return NextResponse.json(
//       { message: "Message are required" },
//       { status: 400 }
//     );
//   }

//   const feedback = await Feedback.create({ email, name, message });

//   return NextResponse.json(
//     { message: "Feedback added successfully", feedback },
//     { status: 201 }
//   );
// }
