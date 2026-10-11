import { Dumbbell, Target, Users, Zap } from "lucide-react"

export const metadata = {
  title: "About Us | Paradise Gym",
  description: "Learn more about Paradise Gym, our mission, vision, and the community we're building in Sitapura, Jaipur.",
}

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <section className="bg-card py-20 text-center border-b">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold uppercase mb-4 tracking-tight">About <span className="text-primary">Paradise Gym</span></h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            More than just a gym. We are a community dedicated to building strength, character, and lifelong habits.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-1/2 space-y-6">
              <h2 className="text-3xl font-bold uppercase">Our Story</h2>
              <div className="h-1 w-20 bg-primary rounded-full"></div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Founded by <strong>Siddharth Meena</strong>, Paradise Gym was established with a singular vision: to provide the people of Sitapura, Jaipur, with a fitness center that rivals the best in the country.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We believe that fitness is not a destination, but a journey. That's why we've created an environment that is welcoming, supportive, and equipped with state-of-the-art facilities to help you achieve your goals, whether you're a beginner or a seasoned athlete.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Our team of dedicated trainers and staff are here to guide you every step of the way, ensuring that you stay motivated and on track.
              </p>
            </div>
            <div className="lg:w-1/2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="h-48 rounded-lg bg-[url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"></div>
                  <div className="h-64 rounded-lg bg-[url('https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"></div>
                </div>
                <div className="space-y-4 mt-8">
                  <div className="h-64 rounded-lg bg-[url('https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"></div>
                  <div className="h-48 rounded-lg bg-[url('https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold uppercase mb-4">Our Core Values</h2>
            <div className="h-1 w-20 bg-primary mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Target, title: "Dedication", desc: "We are committed to helping you reach your peak potential." },
              { icon: Zap, title: "Energy", desc: "A highly motivating environment that pushes you to do better." },
              { icon: Users, title: "Community", desc: "A supportive family of members and trainers cheering you on." },
              { icon: Dumbbell, title: "Excellence", desc: "Premium equipment and top-tier coaching for maximum results." },
            ].map((value, i) => (
              <div key={i} className="text-center space-y-4 p-6 bg-background rounded-lg border border-border/50">
                <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center text-primary">
                  <value.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold">{value.title}</h3>
                <p className="text-muted-foreground">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
