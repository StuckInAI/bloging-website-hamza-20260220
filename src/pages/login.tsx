import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/utils/validation';
import Link from 'next/link';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { LogIn } from 'lucide-react';

interface LoginFormData {
  email: string;
  password: string;
}

export default function Login() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Login failed');
      }
      toast.success('Login successful!');
      router.push('/');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="max-w-md mx-auto card">
      <div className="text-center mb-6">
        <LogIn className="h-12 w-12 text-primary-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Login to Bloging Website</h2>
        <p className="text-gray-600 mt-2">Enter your credentials to access your account</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register('email')}
            className="input-field"
            placeholder="you@example.com"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            {...register('password')}
            className="input-field"
            placeholder="••••••••"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>
        <button type="submit" disabled={isSubmitting} className="w-full btn-primary flex items-center justify-center gap-2">
          <LogIn className="h-4 w-4" />
          {isSubmitting ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p className="text-center text-gray-600 mt-6">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="text-primary-600 hover:underline">
          Sign up here
        </Link>
      </p>
    </div>
  );
}