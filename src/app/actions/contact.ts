"use server"

import prisma from "@/lib/prisma"
import { z } from "zod"

const contactSchema = z.object({
  name: z.string().min(2, "Name is too short").max(100),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number is too short").max(15),
  message: z.string().min(10, "Message is too short").max(1000),
})

export async function submitEnquiry(prevState: any, formData: FormData) {
  try {
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      message: formData.get("message") as string,
    }

    const validatedData = contactSchema.parse(data)

    await prisma.enquiry.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        message: validatedData.message,
      },
    })

    return { success: true, message: "Your message has been sent successfully. We will get back to you soon!" }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, message: error.errors[0].message }
    }
    return { success: false, message: "Something went wrong. Please try again later." }
  }
}
