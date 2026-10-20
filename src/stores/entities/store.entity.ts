import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

// The 38 stores (table: store)
@Entity('store')
export class Store {
  @PrimaryGeneratedColumn() // SERIAL is a regular integer, so a number is safe here
  id: number;

  @Column({ name: 'store_code', type: 'varchar', length: 20, unique: true })
  storeCode: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 60, nullable: true })
  city: string | null;

  @Column({ type: 'varchar', length: 2, nullable: true })
  state: string | null; // DB check: 2 capital letters

  @Column({ name: 'time_zone', type: 'varchar', length: 40, default: 'America/Denver' })
  timeZone: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;
}
