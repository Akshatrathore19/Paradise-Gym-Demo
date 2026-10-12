"use server"

import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const facilitySchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().optional().nullable(),
  icon: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
})

async function requireAdmin() {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized. Admin access required.")
  }
  return session.user
}

export async function createFacility(formData: FormData) {
  try {
    await requireAdmin()

    const rawData = {
      title: formData.get("title") as string,
      description: (formData.get("description") as string) || null,
      icon: (formData.get("icon") as string) || "Dumbbell",
      imageUrl: (formData.get("imageUrl") as string) || null,
      isActive: formData.get("isActive") === "true" || formData.get("isActive") === "on",
    }

    const validated = facilitySchema.parse(rawData)

    const facility = await prisma.facility.create({
      data: {
        title: validated.title,
        description: validated.description,
        icon: validated.icon,
        imageUrl: validated.imageUrl,
        isActive: validated.isActive,
      },
    })

    revalidatePath("/admin/facilities")
    revalidatePath("/facilities")
    revalidatePath("/")

    return { success: true, message: "Facility created successfully", facility }
  } catch (error: any) {
    console.error("Failed to create facility:", error)
    return { success: false, message: error.message || "Failed to create facility" }
  }
}

export async function updateFacility(id: string, formData: FormData) {
  try {
    await requireAdmin()

    const rawData = {
      title: formData.get("title") as string,
      description: (formData.get("description") as string) || null,
      icon: (formData.get("icon") as string) || "Dumbbell",
      imageUrl: (formData.get("imageUrl") as string) || null,
      isActive: formData.get("isActive") === "true" || formData.get("isActive") === "on",
    }

    const validated = facilitySchema.parse(rawData)

    const facility = await prisma.facility.update({
      where: { id },
      data: {
        title: validated.title,
        description: validated.description,
        icon: validated.icon,
        imageUrl: validated.imageUrl,
        isActive: validated.isActive,
      },
    })

    revalidatePath("/admin/facilities")
    revalidatePath("/facilities")
    revalidatePath("/")

    return { success: true, message: "Facility updated successfully", facility }
  } catch (error: any) {
    console.error("Failed to update facility:", error)
    return { success: false, message: error.message || "Failed to update facility" }
  }
}

export async function toggleFacilityStatus(id: string, currentStatus: boolean) {
  try {
    await requireAdmin()

    await prisma.facility.update({
      where: { id },
      data: {
        isActive: !currentStatus,
      },
    })

    revalidatePath("/admin/facilities")
    revalidatePath("/facilities")
    revalidatePath("/")

    return { success: true, message: `Facility is now ${!currentStatus ? 'active' : 'inactive'}` }
  } catch (error: any) {
    console.error("Failed to toggle facility status:", error)
    return { success: false, message: error.message || "Failed to update facility status" }
  }
}

export async function deleteFacility(id: string) {
  try {
    await requireAdmin()

    await prisma.facility.delete({
      where: { id },
    })

    revalidatePath("/admin/facilities")
    revalidatePath("/facilities")
    revalidatePath("/")

    return { success: true, message: "Facility deleted successfully" }
  } catch (error: any) {
    console.error("Failed to delete facility:", error)
    return { success: false, message: error.message || "Failed to delete facility" }
  }
}
