import { NextResponse } from "next/server";
import User from "@/app/model/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function POST(request: Request) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json(
      { message: "Email and password are required" },
      { status: 400 }
    );
  }

  const user = await User.findOne({ email });

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  } else {
    // 🔍 Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }
  }

  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" });

  return NextResponse.json(
    { message: "Login successful", token },
    {
      status: 200,
      headers: { "Content-Type": "application/json" }
    }
  );
}
