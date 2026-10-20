import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { StgSaleEventItem } from "./stg-sale-event-item.entity";
// Entity maps directly to your database tables using an ORM like TypeORM 
@Entity('stg_sale_event')
export class StgSaleEvent {
    @PrimaryGeneratedColumn({name: 'stg_sale_event_id', type: 'bigint'})
    id: string;
    
    @Column({ name: 'sale_uid', type: 'varchar', length: 64})
    saleUid: string;
    
    @Column({ name: 'store_code', type: 'varchar', length: 20, nullable: true})
    storeCode: string | null;
    
    @Column({ name: 'register_code', type: 'varchar', length: 20, nullable: true})
    registerCode: string | null;
    
    @Column({ name: 'cashier_code', type: 'varchar', length: 20, nullable: true})
    cashierCode: string | null;
    
    @Column({ name: 'sold_at', type: 'timestamptz', nullable: true})
    soldAt: Date | null;
    
    @Column({ name: 'currency', type: 'varchar', length: 3 , nullable: true})
    currency: string | null;
    
    @Column({ name: 'subtotal_cents', type: 'int', nullable: true})
    subtotalCents: number | null;
    
    @Column({ name: 'tax_cents', type: 'int', nullable: true})
    taxCents: number | null;
    
    @Column({ name: 'total_cents', type: 'int', nullable: true})
    totalCents: number | null;
    
    @Column({ name: 'payment_method', type: 'varchar', length: 20, nullable: true})
    paymentMethod: string | null;
    
    @Column({ name: 'payment_token', type: 'jsonb'})
    paymentToken: object;
    
    @Column({ name: 'payload', type: 'jsonb'})
    payload: object;
    
    @Column({ name: 'payload_hash', type: 'varchar', length: 64})
    payloadHash: string;
    
    @Column({ name: 'received_at', type: 'timestamptz'})
    receivedAt: Date;
    
    @Column({ name: 'status', type: 'varchar', length: 20})
    status: string;
    
    @Column({ name: 'processed_at', type: 'timestamptz', nullable: true})
    processedAt: Date | null;
    
    @Column({ name: 'error_message', type: 'text', nullable: true})
    errorMessage: string | null;

    @OneToMany(() => StgSaleEventItem, (item) => item.event, { cascade: ['insert']})
    items: StgSaleEventItem[];

}
