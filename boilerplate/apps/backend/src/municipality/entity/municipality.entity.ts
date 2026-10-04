import { Column, Entity, PrimaryColumn, Unique } from 'typeorm';
 
@Entity('municipalities')
@Unique('uq_municipalities_district_id_name', ['districtId', 'name'])
export class Municipality {
  @PrimaryColumn({ type: 'int' })
  id: number;
 
  @Column({ type: 'varchar', length: 150 })
  name: string;
 
  @Column({ name: 'district_id', type: 'int' })
  districtId: number;
}