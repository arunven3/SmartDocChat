import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Document } from './document.entity';

@Entity()
export class Chunk {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  content: string;

  @Column('simple-json')
  embedding: number[];
  
  @Column('int')
  document_id: number;

  @ManyToOne(() => Document, doc => doc.chunks, { onDelete: 'CASCADE' })
  document: Document;
}
