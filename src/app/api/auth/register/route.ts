import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword
      }
    });

    return NextResponse.json(
      { message: "User registered successfully", userId: newUser.id },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      { message: "Something went wrong", error: err },
      { status: 500 }
    );
  }
}

// // src/app/api/auth/register/route.ts
// import { NextResponse } from "next/server";
// import User from "@/app/model/user";
// import bcrypt from "bcryptjs";

// export async function POST(request: Request) {
//   const { email, password } = await request.json();

//   if (!email || !password) {
//     return NextResponse.json(
//       { message: "Email and password are required" },
//       { status: 400 }
//     );
//   }

//   const existingUser = await User.findOne({ email });
//   if (existingUser) {
//     return NextResponse.json(
//       { message: "User already exists" },
//       { status: 400 }
//     );
//   }

//   const hashedPassword = await bcrypt.hash(password, 10);

//   const user = await User.create({ email, password: hashedPassword });

//   return NextResponse.json(
//     { message: "User registered successfully", userId: user._id },
//     { status: 201 }
//   );
// }
