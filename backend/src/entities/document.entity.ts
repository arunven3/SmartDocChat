import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Chunk } from './chunk.entity';

@Entity()
export class Document {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  filename: string;

  @Column('text')
  content: string;

  @CreateDateColumn()
  createdAt: Date;

 @OneToMany(() => Chunk, chunk => chunk.document)
  chunks: Chunk[];

}
