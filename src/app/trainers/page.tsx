import { Card, CardContent } from "@/components/ui/card"
import prisma from "@/lib/prisma"

export const metadata = {
  title: "Our Trainers | Paradise Gym",
  description: "Meet our professional fitness trainers who will guide you to reach your goals.",
}

async function getTrainers() {
  try {
    return await prisma.trainer.findMany({
      where: { isActive: true },
    })
  } catch (e) {
    return []
  }
}

export default async function TrainersPage() {
  const trainers = await getTrainers()

  return (
    <div className="flex flex-col min-h-screen">
      <section className="bg-card py-20 text-center border-b">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold uppercase mb-4 tracking-tight">Our <span className="text-primary">Trainers</span></h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Expert guidance from certified professionals to help you reach your full potential.
          </p>
        </div>
      </section>

      <section className="py-20 bg-background flex-1">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {trainers.map((trainer) => (
              <Card key={trainer.id} className="overflow-hidden border-border/50 hover:border-primary/50 transition-colors">
                <div 
                  className="h-64 w-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${trainer.imageUrl || 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070&auto=format&fit=crop'})` }}
                />
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold mb-1">{trainer.name}</h3>
                  <p className="text-primary font-medium mb-3">{trainer.specialization}</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Experience: <span className="font-semibold text-foreground">{trainer.experience}</span>
                  </p>
                  <p className="text-muted-foreground text-sm line-clamp-3">
                    {trainer.bio || "Dedicated fitness professional committed to helping clients achieve their personal health and fitness goals."}
                  </p>
                </CardContent>
              </Card>
            ))}

            {trainers.length === 0 && (
              <div className="col-span-full text-center py-20 text-muted-foreground">
                Trainer profiles are currently being updated.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
