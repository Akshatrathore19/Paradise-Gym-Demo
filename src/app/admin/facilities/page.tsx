import prisma from "@/lib/prisma"
import FacilitiesClient from "./facilities-client"

export const metadata = {
  title: "Facilities Management | Paradise Gym Admin",
  description: "Manage and update facilities at Paradise Gym.",
}

export default async function AdminFacilitiesPage() {
  const facilities = await prisma.facility.findMany({
    orderBy: { createdAt: "desc" },
  })

  return <FacilitiesClient initialFacilities={facilities} />
}
