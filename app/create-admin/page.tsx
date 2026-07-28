"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, Eye, EyeOff, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { registerAdminUser } from "@/lib/auth-service"
import { authFetch } from "@/lib/auth-fetch"

function authErrorMessage(err: unknown): string {
  const code = err && typeof err === "object" && "code" in err ? String((err as { code: string }).code) : ""
  if (code === "auth/email-already-in-use") return "This email is already registered. Sign in at /login instead."
  if (code === "auth/weak-password") return "Password must be at least 6 characters."
  if (code === "auth/invalid-email") return "Please enter a valid email address."
  if (code === "auth/operation-not-allowed") {
    return "Email/password sign-in is not enabled. In Firebase Console → Authentication → Sign-in method, enable Email/Password."
  }
  if (err instanceof Error) return err.message
  return "Could not create admin account. Please try again."
}

export default function CreateAdminPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [createdEmail, setCreatedEmail] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.email.trim()) {
      setError("Please enter your email address.")
      return
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.")
      return
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters with uppercase, lowercase, and numbers.")
      return
    }

    setIsSubmitting(true)
    try {
      const checkRes = await authFetch("/api/create-admin", {
        method: "POST",
        body: JSON.stringify({ email: formData.email.trim().toLowerCase() }),
      })
      const checkData = await checkRes.json()
      if (!checkRes.ok) {
        setError(checkData.error || "Email not authorized.")
        return
      }

      await registerAdminUser(formData.email, formData.password, formData.name || "Admin")
      setCreatedEmail(formData.email.trim().toLowerCase())
      setSuccess(true)
      setTimeout(() => router.push("/admin"), 2500)
    } catch (err) {
      setError(authErrorMessage(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="page-shell min-h-screen">
      <Header />
      <div className="flex items-center justify-center p-4 pt-20 pb-12">
        <Card className="w-full max-w-md shadow-xl border-0">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
                <Shield className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">Create Admin Account</CardTitle>
            <CardDescription>Enter your own email and password — delete this page after use</CardDescription>
          </CardHeader>
          <CardContent>
            {success ? (
              <div className="space-y-4 text-center">
                <CheckCircle2 className="h-12 w-12 text-emerald-600 mx-auto" />
                <p className="font-medium">Admin account created!</p>
                <p className="text-sm text-muted-foreground">
                  Signed in as <strong>{createdEmail}</strong>
                </p>
                <p className="text-sm text-muted-foreground">Redirecting to admin portal...</p>
                <p className="text-xs text-muted-foreground">
                  Delete <code className="bg-slate-100 px-1 rounded">app/create-admin</code> when done.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="name">Your Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. John Smith"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Your Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="you@yourcompany.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Choose a password (min. 6 characters)"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="Re-enter your password"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating admin..." : "Create Admin Account"}
                </Button>
              </form>
            )}

            {!success && (
              <p className="mt-6 text-center text-sm text-muted-foreground">
                <Link href="/login" className="text-cyan-600 hover:underline font-medium">
                  Back to login
                </Link>
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
