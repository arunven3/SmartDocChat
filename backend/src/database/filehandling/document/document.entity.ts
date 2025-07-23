import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Chunk } from '../chunk/chunk.entity';

@Entity()
export class Document {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  task_id: string

  @Column('text')
  file_name: string;
  
  @OneToMany(() => Chunk, chunk => chunk.document)
  chunks: Chunk[];
}
