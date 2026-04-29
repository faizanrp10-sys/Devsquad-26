import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateRawMaterialDto {
  @IsString()
  name: string;

  @IsString()
  unit: string;

  @IsNumber()
  @Min(0)
  stock: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  minLevel?: number;
}
