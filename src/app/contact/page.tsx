import { MapPin, Phone, Mail, Clock } from "lucide-react"
import { ContactForm } from "@/components/contact-form"
import prisma from "@/lib/prisma"

export const metadata = {
  title: "Contact Us | Paradise Gym",
  description: "Get in touch with Paradise Gym. Visit us in Sitapura, Jaipur or send us an enquiry.",
}

async function getSettings() {
  try {
    return await prisma.gymSettings.findUnique({
      where: { id: "singleton" }
    })
  } catch (e) {
    return null
  }
}

export default async function ContactPage() {
  const settings = await getSettings()

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <section className="bg-card py-20 text-center border-b">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold uppercase mb-4 tracking-tight">Contact <span className="text-primary">Us</span></h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Have questions? We'd love to hear from you. Send us a message or visit our facility.
          </p>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold uppercase mb-6">Get In Touch</h2>
                <div className="h-1 w-20 bg-primary rounded-full mb-8"></div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-6 bg-card rounded-lg border flex flex-col gap-4">
                  <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center text-primary">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Address</h3>
                    <p className="text-muted-foreground">{settings?.address || "Sitapura, Jaipur, Rajasthan, India"}</p>
                  </div>
                </div>

                <div className="p-6 bg-card rounded-lg border flex flex-col gap-4">
                  <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center text-primary">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Phone</h3>
                    <p className="text-muted-foreground">{settings?.phone || "+91 98765 43210"}</p>
                    {settings?.whatsappNumber && (
                      <p className="text-muted-foreground text-sm mt-1">WhatsApp: {settings.whatsappNumber}</p>
                    )}
                  </div>
                </div>

                <div className="p-6 bg-card rounded-lg border flex flex-col gap-4">
                  <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center text-primary">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Email</h3>
                    <p className="text-muted-foreground">{settings?.email || "info@paradisegym.com"}</p>
                  </div>
                </div>

                <div className="p-6 bg-card rounded-lg border flex flex-col gap-4">
                  <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center text-primary">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Timings</h3>
                    <p className="text-muted-foreground whitespace-pre-line">
                      {settings?.timings || "Mon-Sat: 6:00 AM - 10:00 PM\nSunday: Closed"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-card p-8 rounded-lg border shadow-sm">
              <h3 className="text-2xl font-bold mb-6">Send us a Message</h3>
              <ContactForm />
            </div>

          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="h-[400px] w-full bg-muted">
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d113911.3916962295!2d75.76011409726564!3d26.76757130000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396dc9bd5975bbd1%3A0x67db23a54d5801ee!2sSitapura%20Industrial%20Area%2C%20Jaipur%2C%20Rajasthan!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          allowFullScreen 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
          className="grayscale invert opacity-80 hover:grayscale-0 hover:invert-0 hover:opacity-100 transition-all duration-500"
        ></iframe>
      </section>
    </div>
  )
}
