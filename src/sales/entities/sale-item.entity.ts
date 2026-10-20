import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Sale } from './sale.entity';

// One row per line on the receipt (table: sale_item)
// The database also enforces UNIQUE (sale_id, line_number)
@Entity('sale_item')
export class SaleItem {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @ManyToOne(() => Sale, (sale) => sale.items, { nullable: false })
  @JoinColumn({ name: 'sale_id' })
  sale: Sale;

  @Column({ name: 'line_number', type: 'int' })
  lineNumber: number;

  @Column({ type: 'varchar', length: 40 })
  sku: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  description: string | null;

  @Column({ type: 'int' })
  quantity: number; // DB check: greater than 0

  @Column({ name: 'unit_price_cents', type: 'int' })
  unitPriceCents: number;

  @Column({ name: 'discount_cents', type: 'int', default: 0 })
  discountCents: number;

  @Column({ name: 'line_total_cents', type: 'int' })
  lineTotalCents: number;
}
