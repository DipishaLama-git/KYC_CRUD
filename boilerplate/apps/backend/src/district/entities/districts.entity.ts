import { Column, Entity, PrimaryColumn, Unique } from 'typeorm';
 
@Entity('districts')
@Unique('uq_districts_province_id_name', ['provinceId', 'name'])
export class District {
  @PrimaryColumn({ type: 'int' })
  id: number;
 
  @Column({ type: 'varchar', length: 100 })
  name: string;
 
  @Column({ name: 'province_id', type: 'int' })
  provinceId: number;
}