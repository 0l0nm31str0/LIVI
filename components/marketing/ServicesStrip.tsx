import { MessageSquare, Video, Truck } from 'lucide-react'

const services = [
  {
    icon: MessageSquare,
    title: 'Async visits',
    description: 'Message-based consultations when you need answers without scheduling.',
  },
  {
    icon: Video,
    title: 'Video consults',
    description: 'Face-to-face with a licensed physician from your couch.',
  },
  {
    icon: Truck,
    title: 'Rx delivery',
    description: 'Prescriptions filled and shipped directly to your door.',
  },
]

export function ServicesStrip() {
  return (
    <>
      <div className="mb-10 max-w-xl">
        <h2 className="font-display text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          Services
        </h2>
        <p className="mt-3 text-muted-foreground">The care types available through LIVI.</p>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-3 md:overflow-visible">
        {services.map((service) => (
          <div
            key={service.title}
            className="min-w-[260px] flex-shrink-0 rounded-xl border border-border bg-surface p-6 shadow-card md:min-w-0"
          >
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-accent-light text-sage">
              <service.icon className="h-5 w-5" strokeWidth={1.75} />
            </div>
            <h3 className="mb-2 font-semibold text-foreground">{service.title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{service.description}</p>
          </div>
        ))}
      </div>
    </>
  )
}
