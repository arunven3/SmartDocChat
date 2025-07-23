import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', { nullable: true })
  question: string | null;

  @Column('text',  { nullable: true })
  answer: string | null;

  @Column('text')
  task_id: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column('int')
  document_id: number;
}

