import { SaleItemDto } from './sale-item.dto'
import { 
    IsISO8601, 
    IsString, 
    IsArray, 
    MaxLength, 
    Min, 
    IsInt,
    IsOptional, 
    ArrayMinSize,
    ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';

export class SaleDto {
    
    @IsString()
    saleUid: string;
    
    @IsOptional() @IsString()
    storeCode: string | null;
    
    @IsOptional() @IsOptional() @IsString() @MaxLength(20)
    registerCode: string | null;
    
    @IsOptional() @IsString()
    cashierCode: string | null;
    
    @IsOptional() @IsISO8601({ strict: true })
    soldAt: string | null;
    
    @IsOptional() @IsString() @MaxLength(3)
    currency: string | null;
    
    @IsInt()
    subtotalCents: number | null;
    
    @IsOptional() @IsInt() @Min(0)
    taxCents: number | null;
    
    @IsOptional() @IsInt() @Min(0)
    totalCents: number | null;
    
    @IsOptional() @IsString()
    paymentMethod: string | null;
    
    @IsOptional() @IsString()
    paymentToken: string;

    @IsArray() @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => SaleItemDto)
    items: SaleItemDto[];
}
