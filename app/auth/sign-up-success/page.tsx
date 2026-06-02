import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Mail, Compass } from 'lucide-react'

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-background to-amber-50 p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-teal-100 rounded-full">
              <Mail className="h-8 w-8 text-teal-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Check Your Email</CardTitle>
          <CardDescription>
            {"We've sent you a confirmation link"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Please check your email inbox and click the confirmation link to activate your account. 
            Once confirmed, you can start planning your dream trips!
          </p>
          <div className="flex items-center justify-center gap-2 text-teal-600">
            <Compass className="h-5 w-5" />
            <span className="font-medium">Your adventure awaits</span>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button asChild variant="outline" className="w-full">
            <Link href="/auth/login">Back to Login</Link>
          </Button>
          <p className="text-xs text-muted-foreground">
            {"Didn't receive the email? Check your spam folder or try signing up again."}
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
