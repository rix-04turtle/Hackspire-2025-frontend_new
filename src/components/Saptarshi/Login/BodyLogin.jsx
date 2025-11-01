import React, { useState, useRef } from 'react'
import { Mail, Lock, ArrowRight, ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react'
import { useRouter } from 'next/router'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

const BodyLogin = () => {
  const router = useRouter();
  const [step, setStep] = useState(1) // 1: Email, 2: OTP
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address')
      return
    }

    setLoading(true)
    
    const API = `${BASE_URL}/api/auth/send-otp`;
    const params = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    };

    try {
      const response = await fetch(API, params);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send OTP');
      }

      setStep(2);
    } catch (error) {
      setError(error.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const handleOtpSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (otp.length !== 5) {
      setError('Please enter all 5 digits')
      return
    }

    setLoading(true)
    
    const API = `${BASE_URL}/api/auth/verify-otp`;
    const params = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, otp: otp }),
    };

    try {
      const response = await fetch(API, params);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Invalid OTP');
      }

      // Store JWT token in localStorage
      if (data.token) {
        localStorage.setItem('token', data.token);
      }

      // Redirect to home or dashboard
      router.push('/pwa');
    } catch (error) {
      setError(error.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const handleResendOtp = async () => {
    setError('')
    setLoading(true)
    
    const API = `${BASE_URL}/api/auth/send-otp`;
    const params = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    };

    try {
      const response = await fetch(API, params);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to resend OTP');
      }

      setOtp('');
      // You could show a success message here
    } catch (error) {
      setError(error.message || 'Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://i.pinimg.com/originals/ef/0b/27/ef0b27eebc4ed0cce9617771c9256155.jpg"
          alt="Lush farmland background"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/80 via-emerald-950/75 to-emerald-900/60" />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10">
        <div className="w-full max-w-lg space-y-6">
          <div className="space-y-2 text-center text-emerald-100">
            <p className="text-sm uppercase tracking-[0.4em] text-emerald-200/80">Agrivani</p>
            <h1 className="text-3xl font-semibold">Secure Farmer Login</h1>
            <p className="text-sm text-emerald-100/80">
              Access personalized crop insights and tools crafted for your fields.
            </p>
          </div>

          <Card className="border border-white/20 bg-white/90 shadow-2xl backdrop-blur-xl">
            <CardHeader className="space-y-4 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/15 to-emerald-400/40 text-emerald-600 shadow-inner">
                {step === 1 ? <Mail size={32} strokeWidth={1.5} /> : <Lock size={32} strokeWidth={1.5} />}
              </div>
              <div className="flex items-center justify-center gap-3 text-[10px] font-semibold uppercase tracking-[0.35em]">
                <span
                  className={`rounded-full border px-3 py-1 transition-all ${
                    step === 1 ? 'border-emerald-400 bg-emerald-400/15 text-emerald-600' : 'border-slate-200 text-slate-400'
                  }`}
                >
                  Step 01
                </span>
                <span
                  className={`rounded-full border px-3 py-1 transition-all ${
                    step === 2 ? 'border-emerald-400 bg-emerald-400/15 text-emerald-600' : 'border-slate-200 text-slate-400'
                  }`}
                >
                  Step 02
                </span>
              </div>
              <div className="space-y-1">
                <CardTitle className="text-3xl font-semibold text-slate-900">
                  {step === 1 ? 'Welcome Back' : 'Verify Your Email'}
                </CardTitle>
                <CardDescription className="text-base text-slate-500">
                  {step === 1 ? (
                    'Enter your registered email to receive a secure one-time code.'
                  ) : (
                    <>
                      We&apos;ve sent a 5-digit code to{' '}
                      <span className="font-semibold text-slate-700">{email}</span>. Enter it below to continue.
                    </>
                  )}
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {step === 1 && (
                <form onSubmit={handleEmailSubmit} className="space-y-5">
                  <div className="space-y-2 text-left">
                    <Label htmlFor="email" className="text-sm font-medium text-slate-600">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-emerald-500/70" />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="farmer@agrivani.com"
                        disabled={loading}
                        className="h-12 rounded-xl border-slate-200 bg-white/80 pl-11 text-base shadow-sm transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/40 disabled:opacity-60"
                      />
                    </div>
                  </div>

                  {error && (
                    <Alert variant="destructive" className="border-red-200 bg-red-50/90 text-red-600">
                      <AlertTitle>Something went wrong</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    disabled={loading}
                    className="h-12 w-full rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 text-base font-semibold text-white shadow-lg transition hover:from-emerald-500 hover:to-green-500 disabled:cursor-not-allowed disabled:opacity-75"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Sending Code...
                      </>
                    ) : (
                      <>
                        Continue
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>

                  <p className="text-center text-xs text-slate-400">
                    By continuing you agree to our terms and acknowledge our privacy policy.
                  </p>
                </form>
              )}

              {step === 2 && (
                <form onSubmit={handleOtpSubmit} className="space-y-5">
                  <div className="space-y-3 text-center">
                    <Label className="text-sm font-medium text-slate-600">Enter 5-digit verification code</Label>
                    <div className="flex justify-center">
                      <InputOTP maxLength={5} value={otp} onChange={(value) => setOtp(value)}>
                        <InputOTPGroup className="gap-3">
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                  </div>

                  {error && (
                    <Alert variant="destructive" className="border-red-200 bg-red-50/90 text-red-600">
                      <AlertTitle>Something went wrong</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    disabled={loading}
                    className="h-12 w-full rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 text-base font-semibold text-white shadow-lg transition hover:from-emerald-500 hover:to-green-500 disabled:cursor-not-allowed disabled:opacity-75"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        Verify &amp; Login
                        <CheckCircle2 className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>

                  <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setStep(1)}
                      className="flex items-center gap-1 px-0 text-slate-500 hover:text-emerald-600"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Change Email
                    </Button>
                    <Button
                      type="button"
                      variant="link"
                      onClick={handleResendOtp}
                      disabled={loading}
                      className="px-0 text-emerald-600 hover:text-emerald-500 disabled:opacity-60"
                    >
                      {loading ? 'Sending...' : 'Resend code'}
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>

            <CardFooter className="flex flex-col gap-2 text-center text-xs text-slate-500">
              <p>Need help? Reach us at support@agrivani.com</p>
              <p className="text-slate-400">OTP-powered authentication keeps your farming data secure.</p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default BodyLogin