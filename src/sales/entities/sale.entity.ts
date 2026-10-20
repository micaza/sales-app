import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SaleItem } from './sale-item.entity';
import { Store } from '../../stores/entities/store.entity';

// Exactly one row per real sale (table: sale)
@Entity('sale')
export class Sale {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column({ name: 'sale_uid', type: 'varchar', length: 64, unique: true })
  saleUid: string; // the duplicate guard: the database refuses a second copy

  @ManyToOne(() => Store, { nullable: false })
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @Column({ name: 'register_code', type: 'varchar', length: 20, nullable: true })
  registerCode: string | null;

  @Column({ name: 'cashier_code', type: 'varchar', length: 20, nullable: true })
  cashierCode: string | null;

  @Column({ name: 'sold_at', type: 'timestamptz' })
  soldAt: Date;

  @Column({ type: 'varchar', length: 3, default: 'USD' })
  currency: string; // DB check: 3 capital letters

  @Column({ name: 'subtotal_cents', type: 'int' })
  subtotalCents: number;

  @Column({ name: 'tax_cents', type: 'int' })
  taxCents: number;

  @Column({ name: 'total_cents', type: 'int' })
  totalCents: number;

  @Column({ name: 'payment_method', type: 'varchar', length: 20, nullable: true })
  paymentMethod: string | null;

  @Column({ name: 'payment_token', type: 'varchar', length: 100, nullable: true })
  paymentToken: string | null;

  // A plain column, not a relation: staging rows may be cleaned up later
  @Column({ name: 'source_stg_event_id', type: 'bigint', nullable: true })
  sourceStgEventId: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @OneToMany(() => SaleItem, (item) => item.sale, { cascade: ['insert'] })
  items: SaleItem[];
}
