import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { StgSaleEvent } from './stg-sale-event.entity';

// One row per line item of a received event (table: stg_sale_event_item)
@Entity('stg_sale_event_item')
export class StgSaleEventItem {
  @PrimaryGeneratedColumn({ name: 'stg_sale_event_item_id', type: 'bigint' })
  id: string;

  // The foreign key column stg_sale_event_id lives on this side
  @ManyToOne(() => StgSaleEvent, (event) => event.items, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'stg_sale_event_id' })
  event: StgSaleEvent;

  @Column({ name: 'line_number', type: 'int', nullable: true })
  lineNumber: number | null;

  @Column({ type: 'varchar', length: 40, nullable: true })
  sku: string | null;

  @Column({ type: 'varchar', length: 200, nullable: true })
  description: string | null;

  @Column({ type: 'int', nullable: true })
  quantity: number | null;

  @Column({ name: 'unit_price_cents', type: 'int', nullable: true })
  unitPriceCents: number | null;

  @Column({ name: 'discount_cents', type: 'int', nullable: true })
  discountCents: number | null;

  @Column({ name: 'line_total_cents', type: 'int', nullable: true })
  lineTotalCents: number | null;
}
