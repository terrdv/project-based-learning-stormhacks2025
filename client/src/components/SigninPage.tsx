import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { supabase } from '../supabase'
import { Header } from './Header'

type FormData = {
  email: string
  password: string
}

export function SigninPage(): React.ReactElement {
  const navigate = useNavigate()

  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
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
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid'
    if (!formData.password) newErrors.password = 'Password is required'
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
      console.log('Attempting signin with:', formData.email)

      // 1️⃣ Sign up the user in Supabase Auth
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      })

      console.log('Auth signin result:', authData, signInError)

      if (signInError) {
        setErrors({ form: signInError.message })
        return
      }

      if (!authData.user) {
        setErrors({ form: 'Signin failed: no user returned from Supabase Auth' })
        return
      }

      navigate('/dashboard');
    } catch (err: any) {
      console.error('Signin exception:', err)
      setErrors({ form: err?.message ?? 'Signin failed unexpectedly' })
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      {/* Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="mb-2">Log in</h1>
            <p className="text-muted-foreground">Continue your coding journey today</p>
          </div>

          <Card className="border-border">
            <CardHeader>
              <CardTitle>Log In</CardTitle>
              <CardDescription>Enter your details to access your account</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
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

                {/* Form error */}
                {errors.form && <p className="text-sm text-destructive">{errors.form}</p>}

                <Button type="submit" className="w-full">
                  Log In
                </Button>
              </form>
            </CardContent>
          </Card>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don't have an account?{' '}
            <button onClick={() => navigate('/signup')} className="text-primary hover:underline">
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
