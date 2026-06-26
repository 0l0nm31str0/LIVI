import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AuthBrandPanel } from '@/components/marketing/AuthBrandPanel'

export default function SignupPage() {
  return (
    <div className="flex min-h-screen">
      <AuthBrandPanel
        title="Join LIVI"
        description="Full registration is coming soon. Use demo accounts to explore the platform today."
        footer="HIPAA compliant"
      />

      <div className="flex flex-1 items-center justify-center bg-background px-6 py-12">
        <div className="w-full max-w-sm page-enter">
          <div className="mb-8 lg:hidden">
            <Link href="/" className="font-display text-xl font-semibold text-foreground">
              LIVI
            </Link>
          </div>

          <Card className="border-border shadow-elevated">
            <CardHeader>
              <CardTitle>Create an account</CardTitle>
              <CardDescription>Sign up is available in the full platform release.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-6 text-sm text-muted-foreground">
                For now, use the demo login to explore patient, doctor, and pharmacy experiences.
              </p>
              <Link href="/login">
                <Button className="w-full">
                  Go to sign in
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
