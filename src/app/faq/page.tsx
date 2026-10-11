import prisma from "@/lib/prisma"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export const metadata = {
  title: "FAQ | Paradise Gym",
  description: "Frequently asked questions about Paradise Gym, our memberships, facilities, and rules.",
}

async function getFAQs() {
  try {
    return await prisma.fAQ.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "asc" },
    })
  } catch (e) {
    return []
  }
}

export default async function FAQPage() {
  const faqs = await getFAQs()

  return (
    <div className="flex flex-col min-h-screen">
      <section className="bg-card py-20 text-center border-b">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold uppercase mb-4 tracking-tight">Frequently Asked <span className="text-primary">Questions</span></h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Find answers to common questions about memberships, facilities, and more.
          </p>
        </div>
      </section>

      <section className="py-20 bg-background flex-1">
        <div className="container mx-auto px-4 max-w-3xl">
          {faqs.length > 0 ? (
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={faq.id} value={`item-${index}`}>
                  <AccordionTrigger className="text-left text-lg font-semibold">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="text-center py-20 text-muted-foreground bg-card rounded-lg border">
              FAQs are currently being updated. Please check back later or contact us directly.
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
