import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '@/entities/User';
import { Post } from '@/entities/Post';
import { Comment } from '@/entities/Comment';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: process.env.DATABASE_PATH || './database.sqlite',
  synchronize: false,
  logging: false,
  entities: [User, Post, Comment],
  migrations: ['src/migrations/*.ts'],
  subscribers: [],
});

export async function initializeDatabase() {
  try {
    await AppDataSource.initialize();
    console.log('Database connection established');
  } catch (error) {
    console.error('Error connecting to database:', error);
  }
}