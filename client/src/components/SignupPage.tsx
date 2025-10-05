import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, User } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Checkbox } from './ui/checkbox'
import { supabase } from '../supabase'
import { Header } from './Header'

type FormData = {
  name: string
  email: string
  password: string
  confirmPassword: string
  agreeTerms: boolean
}

export function SignupPage(): React.ReactElement {
  const navigate = useNavigate()

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (field: keyof FormData, value: string | boolean) => {
    setFormData((s) => ({ ...s, [field]: value } as FormData))
    if (errors[field as string]) {
      const next = { ...errors }
      delete next[field as string]
      setErrors(next)
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid'
    if (!formData.password) newErrors.password = 'Password is required'
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters'
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match'
    if (!formData.agreeTerms) newErrors.agreeTerms = 'You must agree to the terms'
    return newErrors
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const newErrors = validateForm()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      console.log('Attempting signup with:', formData.email)

      // 1️⃣ Sign up the user in Supabase Auth
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: { full_name: formData.name }, // optional metadata
        },
      })

      console.log('Auth signup result:', authData, signUpError)

      if (signUpError) {
        setErrors({ form: signUpError.message })
        return
      }

      if (!authData.user) {
        setErrors({ form: 'Signup failed: no user returned from Supabase Auth' })
        return
      }

      navigate('/dashboard');
    } catch (err: any) {
      console.error('Signup exception:', err)
      setErrors({ form: err?.message ?? 'Signup failed unexpectedly' })
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <Header />

      {/* Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="mb-2">Create Your Account</h1>
            <p className="text-muted-foreground">Start your coding journey today</p>
          </div>

          <Card className="border-border">
            <CardHeader>
              <CardTitle>Sign Up</CardTitle>
              <CardDescription>Enter your details to create your free account</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Name"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      className={`pl-10 ${errors.name ? 'border-destructive' : ''}`}
                    />
                  </div>
                  {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className={`pl-10 ${errors.email ? 'border-destructive' : ''}`}
                    />
                  </div>
                  {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => handleChange('password', e.target.value)}
                      className={`pl-10 ${errors.password ? 'border-destructive' : ''}`}
                    />
                  </div>
                  {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={(e) => handleChange('confirmPassword', e.target.value)}
                      className={`pl-10 ${errors.confirmPassword ? 'border-destructive' : ''}`}
                    />
                  </div>
                  {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword}</p>}
                </div>

                {/* Terms */}
                <div className="flex items-start gap-2">
                  <Checkbox
                    id="terms"
                    checked={formData.agreeTerms}
                    onCheckedChange={(c) => handleChange('agreeTerms', c as boolean)}
                    className={errors.agreeTerms ? 'border-destructive' : ''}
                  />
                  <Label htmlFor="terms" className="text-sm cursor-pointer leading-tight">
                    I agree to the Terms of Service and Privacy Policy
                  </Label>
                </div>
                {errors.agreeTerms && <p className="text-xs text-destructive">{errors.agreeTerms}</p>}

                {/* Form error */}
                {errors.form && <p className="text-sm text-destructive">{errors.form}</p>}

                <Button type="submit" className="w-full">
                  Create Account
                </Button>
              </form>
            </CardContent>
          </Card>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{' '}
            <button onClick={() => navigate('/signin')} className="text-primary hover:underline">
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
