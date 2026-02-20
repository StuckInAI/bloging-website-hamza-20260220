import { NextRequest, NextResponse } from 'next/server';
import { AppDataSource } from '@/lib/database';
import { User } from '@/entities/User';
import { registerSchema } from '@/utils/validation';
import { hashPassword, setAuthCookie } from '@/utils/auth';

export async function POST(request: NextRequest) {
  await AppDataSource.initialize();
  const body = await request.json();
  const result = registerSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: result.error.errors[0].message }, { status: 400 });
  }
  const { name, email, password } = result.data;
  const userRepository = AppDataSource.getRepository(User);
  const existingUser = await userRepository.findOne({ where: { email } });
  if (existingUser) {
    return NextResponse.json({ error: 'User already exists' }, { status: 400 });
  }
  const hashedPassword = await hashPassword(password);
  const user = userRepository.create({ name, email, password: hashedPassword });
  await userRepository.save(user);
  await setAuthCookie(user.id);
  return NextResponse.json({ message: 'User created successfully', user: { id: user.id, name: user.name, email: user.email } }, { status: 201 });
}