import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authStore } from '@/entities/user/model';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

const LoginPage = observer(function LoginPage() {
  const navigate = useNavigate();
  const isInitialized = authStore.isInitialized;
  const isAuthenticated = authStore.isAuthenticated;

  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      navigate('/products', { replace: true });
    }
  }, [isInitialized, isAuthenticated, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: '', password: '' },
  });

  const onSubmit = async (data: LoginForm) => {
    const success = await authStore.login(data.username, data.password);
    if (success) {
      navigate('/products', { replace: true });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
      <div className="w-full max-w-md p-8 bg-card rounded-xl shadow-lg border">
        <h1 className="text-2xl font-semibold text-center mb-6">Admin Dashboard</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              {...register('username')}
              placeholder="emilys"
              autoComplete="username"
            />
            {errors.username && (
              <p className="text-sm text-destructive">{errors.username.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              {...register('password')}
              placeholder="••••••••"
              autoComplete="current-password"
            />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={authStore.isLoading}>
            {authStore.isLoading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
        <p className="mt-4 text-sm text-muted-foreground text-center">
          Use credentials from dummyjson.com/users (e.g. emilys / emilyspass)
        </p>
      </div>
    </div>
  );
});

export default LoginPage;
