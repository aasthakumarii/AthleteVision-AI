import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { useNavigate, Link } from 'react-router-dom'
import { loginUser } from '@/api/auth'
import { useAuthStore } from '@/store/authStore'
import { Activity, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type FormData = z.infer<typeof schema>

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      login(data.user, data.token)
      const home = data.user.role === 'ATHLETE' ? '/athlete/dashboard' : '/coach/dashboard'
      navigate(home, { replace: true })
    },
    onError: () => {
      setError('password', { message: 'Invalid email or password' })
    },
  })

  const onSubmit = (data: FormData) => mutation.mutate(data)

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Activity size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AthleteIQ</h1>
              <p className="text-xs text-indigo-600 font-medium">Performance Platform</p>
            </div>
          </div>
        </div>

        {/* Card */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Welcome back</h2>
          <p className="text-sm text-gray-500 mb-6">Sign in to your account to continue</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                {...register('email')}
                placeholder="you@example.com"
                className="input"
                autoComplete="email"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  placeholder="••••••••"
                  className="input pr-10"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={mutation.isPending}
              className="btn-primary w-full flex items-center justify-center gap-2 py-2.5"
            >
              {mutation.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-600 font-medium hover:underline">
              Create one
            </Link>
          </p>
        </div>

        {/* Demo quick-login */}
        <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <p className="text-xs font-semibold text-amber-800 mb-3">⚡ Quick Demo Login (no backend needed)</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: '🏃 Athlete Login', email: 'athlete@demo.com', color: 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200' },
              { label: '🏋️ Coach Login', email: 'coach@demo.com', color: 'bg-green-100 text-green-700 hover:bg-green-200' },
            ].map((d) => (
              <button
                key={d.email}
                type="button"
                disabled={mutation.isPending}
                onClick={() => mutation.mutate({ email: d.email, password: 'demo123' })}
                className={`${d.color} text-xs font-medium py-2 px-3 rounded-lg transition-colors`}
              >
                {d.label}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-amber-600 mt-2">Password: <code className="bg-amber-100 px-1 rounded">demo123</code></p>
        </div>
      </div>
    </div>
  )
}
