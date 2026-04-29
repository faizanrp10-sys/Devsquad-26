import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class UpdateRawMaterialDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  unit?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  stock?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  minLevel?: number;
}
