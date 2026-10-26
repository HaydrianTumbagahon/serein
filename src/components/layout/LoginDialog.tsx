import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { authStore } from '@/store/authStore'

const schema = z.object({
  name: z.string().optional(),
  email: z.email('Enter a valid email address.').refine((value) => !/[{}<>]/.test(value), 'Email contains unsupported characters.'),
  password: z
    .string()
    .min(10, 'Use at least 10 characters.')
    .max(128, 'Use no more than 128 characters.')
    .refine((value) => !/[{}<>]/.test(value), 'Braces and angle brackets are not allowed.'),
})
type LoginValues = z.infer<typeof schema>
type LoginMode = 'login' | 'signup'

function LoginDialog() {
  const open = authStore((state) => state.loginOpen)
  const setOpen = authStore((state) => state.setLoginOpen)
  const registerAccount = authStore((state) => state.registerAccount)
  const authenticate = authStore((state) => state.authenticate)
  const [mode, setMode] = useState<LoginMode>('login')
  const [showPassword, setShowPassword] = useState(false)
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '', password: '' },
  })

  const close = (nextOpen: boolean) => {
    setOpen(nextOpen)
    if (!nextOpen) {
      reset()
      setMode('login')
    }
  }

  const submit = handleSubmit(async (values) => {
    if (mode === 'signup') {
      const name = values.name?.trim() ?? ''
      if (name.length < 2 || !/^[\p{L}\p{M}][\p{L}\p{M} .'-]*$/u.test(name)) {
        setError('name', { message: 'Use at least two letters; punctuation is limited to spaces, apostrophes, and hyphens.' })
        return
      }
      try {
        const created = await registerAccount(name, values.email, values.password)
        if (!created) {
          setError('email', { message: 'An account already exists for this email. Sign in instead.' })
          setMode('login')
          return
        }
        setMode('login')
        reset({ name: '', email: values.email, password: '' })
        toast.success('Account created. Sign in to continue.')
      } catch {
        toast.error('Unable to create an account in this browser. Please try again.')
      }
      return
    }

    try {
      const signedIn = await authenticate(values.email, values.password)
      if (!signedIn) {
        setError('email', { message: 'No matching account was found. Create an account first or check your details.' })
        setError('password', { message: 'The email and password do not match.' })
        return
      }
      toast.success('Welcome back')
    } catch {
      toast.error('Unable to sign in from this browser. Please try again.')
    }
  })

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-2xl p-6 sm:max-w-md sm:p-8">
        <DialogHeader className="items-center text-center">
          <DialogTitle className="font-heading text-3xl">
            {mode === 'login' ? 'Welcome back' : 'Join Serein'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'login'
              ? 'Sign in to keep your stays close at hand.'
              : 'Create an account for a more thoughtful way to travel.'}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2 grid grid-cols-2 rounded-xl bg-muted p-1" role="tablist" aria-label="Account access">
          {(['login', 'signup'] as const).map((item) => (
            <button
              key={item}
              type="button"
              role="tab"
              aria-selected={mode === item}
              onClick={() => {
                setMode(item)
                reset()
              }}
              className={`min-h-11 rounded-lg text-sm font-medium capitalize transition-colors ${
                mode === item ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {item === 'login' ? 'Log in' : 'Sign up'}
            </button>
          ))}
        </div>

        <form onSubmit={submit} noValidate className="mt-4 space-y-4">
          {mode === 'signup' && (
            <div>
              <Label htmlFor="auth-name">Full name</Label>
              <Input id="auth-name" autoComplete="name" placeholder="Your name" className="mt-2 h-11" aria-invalid={Boolean(errors.name)} {...register('name')} />
              {errors.name && <p role="alert" className="mt-1.5 text-xs text-destructive">{errors.name.message}</p>}
            </div>
          )}
          <div>
            <Label htmlFor="auth-email">Email address</Label>
            <Input id="auth-email" type="email" autoComplete="email" placeholder="you@example.com" className="mt-2 h-11" aria-invalid={Boolean(errors.email)} {...register('email')} />
            {errors.email && <p role="alert" className="mt-1.5 text-xs text-destructive">{errors.email.message}</p>}
          </div>
          <div>
            <Label htmlFor="auth-password">Password</Label>
            <div className="relative mt-2">
              <Input
                id="auth-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                placeholder="At least 10 characters"
                className="h-11 pr-11"
                aria-invalid={Boolean(errors.password)}
                {...register('password')}
              />
              <button
                type="button"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword((show) => !show)}
                className="absolute inset-y-0 right-0 flex min-h-11 w-11 items-center justify-center text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {errors.password && <p role="alert" className="mt-1.5 text-xs text-destructive">{errors.password.message}</p>}
          </div>
          <Button type="submit" size="lg" disabled={isSubmitting} className="w-full">
            {mode === 'login' ? 'Log in' : 'Create account'}
            <ArrowRight aria-hidden="true" />
          </Button>
        </form>

        <p className="text-center text-[11px] leading-5 text-muted-foreground">
          Demo account details are saved in this browser only and are never sent to a server. Do not reuse a real password.
        </p>
      </DialogContent>
    </Dialog>
  )
}

export { LoginDialog }
