import prisma from "@/lib/prisma"
import Image from "next/image"

export const metadata = {
  title: "Gallery | Paradise Gym",
  description: "Take a look inside Paradise Gym. View our equipment, classes, and facilities.",
}

async function getImages() {
  try {
    return await prisma.galleryImage.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    })
  } catch (e) {
    return []
  }
}

export default async function GalleryPage() {
  const images = await getImages()

  return (
    <div className="flex flex-col min-h-screen">
      <section className="bg-card py-20 text-center border-b">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold uppercase mb-4 tracking-tight">Our <span className="text-primary">Gallery</span></h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A glimpse into the energy, equipment, and community at Paradise Gym.
          </p>
        </div>
      </section>

      <section className="py-20 bg-background flex-1">
        <div className="container mx-auto px-4">
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
            {images.map((image) => (
              <div key={image.id} className="break-inside-avoid overflow-hidden rounded-lg relative group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={image.imageUrl} 
                  alt={image.title || "Gym Gallery Image"} 
                  className="w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="text-center p-4">
                    <p className="text-white font-bold text-lg mb-1">{image.title}</p>
                    <p className="text-primary text-sm uppercase tracking-wider">{image.category}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {images.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              Gallery is currently being updated.
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
