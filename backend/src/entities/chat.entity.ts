import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', { nullable: true })
  question: string | null;

  @Column('text',  { nullable: true })
  answer: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @Column('int')
  document_id: number;
}

