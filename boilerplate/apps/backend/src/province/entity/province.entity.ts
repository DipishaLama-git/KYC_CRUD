import { Column, Entity, PrimaryColumn } from 'typeorm';
 
@Entity('provinces')
export class Province {
  @PrimaryColumn({ type: 'int' })
  id: number;
 
  @Column({ type: 'varchar', length: 100, unique: true })
  name: string;
}