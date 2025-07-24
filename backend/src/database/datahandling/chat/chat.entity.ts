import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  question: string | null;

  @Column('text')
  answer: string | null;

  @Column('text')
  task_id: string;

  @CreateDateColumn()
  createdAt: Date;
}

