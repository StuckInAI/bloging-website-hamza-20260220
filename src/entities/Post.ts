import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from './User';
import { Comment } from './Comment';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ default: 'entertainment' })
  category: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.posts, { onDelete: 'CASCADE' })
  author: User;

  @OneToMany(() => Comment, (comment) => comment.post, { cascade: true })
  comments: Comment[];
}