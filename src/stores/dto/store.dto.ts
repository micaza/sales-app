import { IsOptional, IsString, MaxLength } from "class-validator";

export class Store {

  @IsString()
  storeCode: string;

  @IsString()
  name: string;

  @IsString() @IsOptional()
  city: string | null;

  @IsString() @IsOptional() @MaxLength(2)
  state: string | null; // DB check: 2 capital letters

  @IsString() 
  timeZone: string;

  @IsString()
  isActive: boolean;

}
