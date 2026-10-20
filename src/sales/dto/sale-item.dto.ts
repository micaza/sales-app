import { IsInt, IsString, MaxLength } from "class-validator";

export class SaleItemDto {
   
    @IsInt()
    lineNumber: number;            //INTEGER,
    @IsString() @MaxLength(40)
    sku: string;                    //VARCHAR(40),
    @IsString() @MaxLength(200)
    description: string;            //VARCHAR(200),
    @IsInt()
    quantity: number;               //INTEGER,
    @IsInt()
    unitPriceCents: number;       //INTEGER,
    @IsInt()
    discountCents: number;         //INTEGER,
    @IsInt()
    lineTotalCents: number;       //INTEGER
}