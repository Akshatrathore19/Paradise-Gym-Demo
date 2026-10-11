import { Card, CardContent } from "@/components/ui/card"
import prisma from "@/lib/prisma"

export const metadata = {
  title: "Facilities | Paradise Gym",
  description: "Explore the premium facilities available at Paradise Gym, Sitapura.",
}

async function getFacilities() {
  try {
    return await prisma.facility.findMany({
      where: { isActive: true },
    })
  } catch (e) {
    return []
  }
}

export default async function FacilitiesPage() {
  const facilities = await getFacilities()

  return (
    <div className="flex flex-col min-h-screen">
      <section className="bg-card py-20 text-center border-b">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold uppercase mb-4 tracking-tight">Our <span className="text-primary">Facilities</span></h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            State-of-the-art equipment and spaces designed for all types of workouts.
          </p>
        </div>
      </section>

      <section className="py-20 bg-background flex-1">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {facilities.map((facility) => (
              <Card key={facility.id} className="overflow-hidden border-border/50 hover:border-primary/50 transition-colors group">
                <div 
                  className="h-48 w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url(${facility.imageUrl || 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=2070&auto=format&fit=crop'})` }}
                />
                <CardContent className="p-6 bg-card relative z-10">
                  <h3 className="text-xl font-bold mb-2">{facility.title}</h3>
                  <p className="text-muted-foreground">
                    {facility.description}
                  </p>
                </CardContent>
              </Card>
            ))}

            {facilities.length === 0 && (
              <div className="col-span-full text-center py-20 text-muted-foreground">
                Facilities list is currently being updated.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
