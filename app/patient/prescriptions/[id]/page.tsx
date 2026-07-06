import { redirect } from 'next/navigation'

interface Props { params: { id: string } }

// Deprecated: redirected to orders (marketplace MVP)
export default function PrescriptionDetailRedirect({ params }: Props) {
  redirect(`/patient/orders/${params.id}`)
}
