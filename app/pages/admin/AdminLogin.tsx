import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Lock, Mail, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { adminAPI, settingsAPI } from '@/lib/api';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(1, 'Password is required'),
});

const AdminLogin = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: () => settingsAPI.get(),
  });

  const loginMutation = useMutation({
    mutationFn: (data: { email: string; password: string }) => adminAPI.login(data.email, data.password),
    onSuccess: (data) => {
      localStorage.setItem('adminToken', data.token);
      navigate('/admin/dashboard');
    },
    onError: (err: any) => {
      setError(err.message || 'Invalid email or password');
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      loginSchema.parse(formData);
      loginMutation.mutate(formData);
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-4">
      <Helmet>
        <title>Admin Login | {settings?.siteName || 'Car Dealership'}</title>
      </Helmet>

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold text-primary-foreground">
            Kaushik<span className="text-accent"> Motors</span>
          </h1>
          <p className="text-primary-foreground/60 mt-2">Admin Panel</p>
        </div>

        {/* Login Card */}
        <div className="bg-card rounded-xl p-8 shadow-xl">
          <h2 className="font-display text-2xl font-bold text-foreground text-center mb-6">
            Welcome Back
          </h2>

          {error && (
            <div className="flex items-center gap-2 p-3 mb-6 rounded-lg bg-destructive/10 text-destructive text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="admin@autoelite.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>

            <Button type="submit" variant="gold" className="w-full" disabled={loginMutation.isPending}>
              {loginMutation.isPending ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {/* <p className="text-center text-muted-foreground text-sm mt-6">
            Demo: admin@autoelite.com / admin123
          </p> */}
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
