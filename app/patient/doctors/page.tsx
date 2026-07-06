import { redirect } from 'next/navigation'

export default function PatientDoctorsPage() {
  redirect('/shop?tab=prescription')
}
