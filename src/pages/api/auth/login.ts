import { NextRequest, NextResponse } from 'next/server';
import { AppDataSource } from '@/lib/database';
import { User } from '@/entities/User';
import { loginSchema } from '@/utils/validation';
import { verifyPassword, setAuthCookie } from '@/utils/auth';

export async function POST(request: NextRequest) {
  await AppDataSource.initialize();
  const body = await request.json();
  const result = loginSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: result.error.errors[0].message }, { status: 400 });
  }
  const { email, password } = result.data;
  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository.findOne({ where: { email } });
  if (!user || !(await verifyPassword(password, user.password))) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }
  await setAuthCookie(user.id);
  return NextResponse.json({ message: 'Login successful', user: { id: user.id, name: user.name, email: user.email } });
}