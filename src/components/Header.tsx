import Link from 'next/link';
import { Menu, LogOut, User, Edit } from 'lucide-react';
import { getCurrentUser } from '@/utils/auth';
import { clearAuthCookie } from '@/utils/auth';

export default async function Header() {
  const user = await getCurrentUser();

  const handleLogout = async () => {
    'use server';
    clearAuthCookie();
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-primary-700 flex items-center gap-2">
          <Menu className="h-6 w-6" />
          Bloging Website
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/" className="text-gray-700 hover:text-primary-600 transition-colors">
            Home
          </Link>
          <Link href="/create-post" className="text-gray-700 hover:text-primary-600 transition-colors flex items-center gap-1">
            <Edit className="h-4 w-4" />
            Write
          </Link>
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-gray-700 flex items-center gap-1">
                <User className="h-4 w-4" />
                {user.name}
              </span>
              <form action={handleLogout}>
                <button type="submit" className="btn-primary flex items-center gap-1">
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </form>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/login" className="btn-secondary">
                Login
              </Link>
              <Link href="/register" className="btn-primary">
                Sign Up
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}