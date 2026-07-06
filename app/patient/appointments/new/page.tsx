import { redirect } from 'next/navigation'

// Deprecated: redirected to shop (marketplace MVP)
export default function NewAppointmentRedirect() {
  redirect('/shop?tab=prescription')
}
