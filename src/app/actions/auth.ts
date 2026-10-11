"use server"

import { signIn, signOut } from "@/auth"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"

export async function loginAction(prevState: any, formData: FormData) {
  try {
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    
    if (!email || !password) {
      return { success: false, message: "Email and password are required" }
    }
    
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    })
    
    return { success: true, message: "Logged in successfully" }
  } catch (error: any) {
    if (error.type === "CredentialsSignin") {
      return { success: false, message: "Invalid email or password" }
    }
    return { success: false, message: "Something went wrong" }
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: "/" })
}

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
})

export async function registerAction(prevState: any, formData: FormData) {
  try {
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      password: formData.get("password") as string,
      confirmPassword: formData.get("confirmPassword") as string,
    }
    
    const validatedData = registerSchema.parse(data)
    
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    })
    
    if (existingUser) {
      return { success: false, message: "Email already in use" }
    }
    
    const hashedPassword = await bcrypt.hash(validatedData.password, 10)
    
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        password: hashedPassword,
        role: "MEMBER",
        memberProfile: {
          create: {}
        }
      }
    })
    
    return { success: true, message: "Registration successful. Please log in." }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, message: error.errors[0].message }
    }
    return { success: false, message: "Registration failed. Please try again." }
  }
}
