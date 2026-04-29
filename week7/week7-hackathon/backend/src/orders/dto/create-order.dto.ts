import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  ValidateNested,
  IsEnum,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItemDto {
  @IsString()
  productId: string;

  @IsString()
  productName: string;

  @IsString()
  @IsOptional()
  productImage?: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsString()
  @IsOptional()
  note?: string;
}

export class CreateOrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @IsNumber()
  @Min(0)
  @IsOptional()
  discount?: number;

  @IsEnum(['Dine In', 'To Go', 'Delivery'])
  orderType: string;

  @IsEnum(['Credit Card', 'Paypal', 'Cash'])
  paymentMethod: string;

  @IsString()
  @IsOptional()
  tableNo?: string;

  @IsString()
  @IsOptional()
  customerName?: string;
}
