// src/presentation/features/auth/pages/LoginPage.tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/presentation/components/ui/button'
import { Input } from '@/presentation/components/ui/input'
import { Label } from '@/presentation/components/ui/label'
import { Card, CardContent, CardHeader } from '@/presentation/components/ui/card'
import { Alert, AlertDescription } from '@/presentation/components/ui/alert'
import { useLogin } from '@/core/auth'
import logo from '@/assets/logo.png'
import hero from '@/assets/hero.jpg'

const loginSchema = z.object({
  userName: z.string().min(1, 'Ingresa tu usuario'),
  password: z.string().min(1, 'Ingresa tu contraseña'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginPage() {
  const navigate = useNavigate()
  const loginMutation = useLogin()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data, {
      onSuccess: () => navigate('/scenarios', { replace: true }),
    })
  }

  return (
    <div className="min-h-screen flex">
      {/* Imagen hero — visible solo en pantallas grandes */}
      <div
        className="hidden lg:flex flex-1 bg-cover bg-center"
        style={{ backgroundImage: `url(${hero})` }}
      />

      {/* Formulario de login */}
      <div className="flex flex-1 items-center justify-center p-8 bg-background">
        <Card className="w-full max-w-sm shadow-lg">
          <CardHeader className="items-center pb-2">
            <img src={logo} alt="Aguas Perlitas" className="h-24 object-contain mb-2" />
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {loginMutation.isError && (
                <Alert variant="destructive">
                  <AlertDescription>
                    {(loginMutation.error as Error).message}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-1">
                <Label htmlFor="userName">Usuario</Label>
                <Input
                  id="userName"
                  autoComplete="username"
                  placeholder="tu.usuario"
                  {...register('userName')}
                />
                {errors.userName && (
                  <p className="text-xs text-destructive">{errors.userName.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  {...register('password')}
                />
                {errors.password && (
                  <p className="text-xs text-destructive">{errors.password.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? 'Ingresando...' : 'Ingresar'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
