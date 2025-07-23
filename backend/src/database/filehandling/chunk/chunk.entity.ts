import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Document } from '../document/document.entity';

@Entity()
export class Chunk {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  chunk: string;

  @Column('simple-json')
  embedding: number[];
  
  @Column('int')
  document_id: number;

  @Column('text')
  task_id: string;

  @ManyToOne(() => Document, doc => doc.chunks, { onDelete: 'CASCADE' })
  document: Document;
}
