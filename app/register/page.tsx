'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { toast } from 'sonner'
import { Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState<string | null>(null)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/customer/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone, password: form.password }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'Registration failed')
        return
      }
      // Auto sign in after registration
      const result = await signIn('customer-credentials', {
        identifier: form.email,
        password: form.password,
        redirect: false,
      })
      if (result?.error) {
        toast.error('Account created but sign-in failed. Please log in.')
        router.push('/login')
      } else {
        toast.success('Welcome to Crazy Chips! 🍟')
        router.push('/')
      }
    } catch {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleOAuth = async (provider: string) => {
    setOauthLoading(provider)
    await signIn(provider, { callbackUrl: '/' })
  }

  const fields = [
    { key: 'name', label: 'Full Name', type: 'text', placeholder: 'John Smith', icon: User },
    { key: 'email', label: 'Email', type: 'email', placeholder: 'john@example.com', icon: Mail },
    { key: 'phone', label: 'Phone (optional)', type: 'tel', placeholder: '07700 900000', icon: Phone },
  ]

  return (
    <div className="min-h-screen bg-[#FFF8EE] relative overflow-hidden">
      <div className="absolute top-[-80px] right-[-80px] w-[320px] h-[320px] bg-[#FFD600] rounded-full opacity-25 pointer-events-none" />
      <div className="absolute bottom-[-60px] left-[-60px] w-[250px] h-[250px] bg-[#D92B2B] rounded-full opacity-10 pointer-events-none" />

      <div className="relative flex items-center justify-center min-h-screen p-5">
        <div className="bg-white rounded-[28px] w-full max-w-[420px] shadow-[0_8px_40px_rgba(61,34,0,0.18)] p-8 sm:p-10">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <Image src="/logo.png" alt="Crazy Chips" width={72} height={72} className="rounded-2xl mb-3" />
            <h1 className="text-2xl text-[#3D2200]" style={{ fontFamily: 'var(--font-lilita)' }}>
              Create Account
            </h1>
            <p className="text-[#8a7a6a] text-sm font-[600] mt-1">Join Crazy Chips today</p>
          </div>

          {/* OAuth buttons */}
          <div className="space-y-3 mb-6">
            <button
              onClick={() => handleOAuth('google')}
              disabled={!!oauthLoading}
              className="w-full flex items-center justify-center gap-3 bg-white border-2 border-[#F5EDD8] hover:bg-[#FFF8EE] rounded-[13px] py-3 font-[700] text-[#3D2200] text-sm transition-all disabled:opacity-60 shadow-[0_2px_8px_rgba(0,0,0,.06)]"
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {oauthLoading === 'google' ? 'Connecting...' : 'Sign up with Google'}
            </button>

            <button
              onClick={() => handleOAuth('apple')}
              disabled={!!oauthLoading}
              className="w-full flex items-center justify-center gap-3 bg-[#000] hover:bg-[#222] rounded-[13px] py-3 font-[700] text-white text-sm transition-all disabled:opacity-60"
            >
              <svg width="17" height="20" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.4c1.39.07 2.34.74 3.15.77 1.2-.25 2.35-.95 3.65-.84 1.56.15 2.73.7 3.49 1.81-3.22 1.9-2.46 5.78.49 6.93-.57 1.5-1.31 2.99-2.78 4.21zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              {oauthLoading === 'apple' ? 'Connecting...' : 'Sign up with Apple'}
            </button>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-[#F5EDD8]" />
            <span className="text-[#8a7a6a] text-xs font-[700]">or sign up with email</span>
            <div className="flex-1 h-px bg-[#F5EDD8]" />
          </div>

          <form onSubmit={handleRegister} className="space-y-3">
            {fields.map(({ key, label, type, placeholder, icon: Icon }) => (
              <div key={key} className="relative">
                <Icon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8a7a6a]" />
                <input
                  type={type}
                  required={key !== 'phone'}
                  value={form[key as keyof typeof form]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  placeholder={placeholder}
                  className="w-full pl-11 pr-4 py-3 border-2 border-[#F5EDD8] rounded-[12px] text-sm font-[600] text-[#3D2200] placeholder:text-[#c4b49a] placeholder:font-[500] focus:outline-none focus:border-[#D92B2B] bg-white transition-colors"
                />
              </div>
            ))}

            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8a7a6a]" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Password (min. 8 characters)"
                className="w-full pl-11 pr-11 py-3 border-2 border-[#F5EDD8] rounded-[12px] text-sm font-[600] text-[#3D2200] placeholder:text-[#c4b49a] placeholder:font-[500] focus:outline-none focus:border-[#D92B2B] bg-white transition-colors"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8a7a6a]">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8a7a6a]" />
              <input
                type="password"
                required
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                placeholder="Confirm password"
                className="w-full pl-11 pr-4 py-3 border-2 border-[#F5EDD8] rounded-[12px] text-sm font-[600] text-[#3D2200] placeholder:text-[#c4b49a] placeholder:font-[500] focus:outline-none focus:border-[#D92B2B] bg-white transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#D92B2B] hover:bg-[#B01E1E] text-white font-[800] py-3.5 rounded-[13px] text-sm transition-all disabled:opacity-60 shadow-[0_4px_14px_rgba(217,43,43,.35)] mt-1"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-[#8a7a6a] font-[600] mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-[#D92B2B] font-[800] hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
