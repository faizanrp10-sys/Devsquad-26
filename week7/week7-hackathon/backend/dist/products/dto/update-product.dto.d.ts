import { RecipeItemDto } from './create-product.dto';
export declare class UpdateProductDto {
    name?: string;
    price?: number;
    image?: string;
    category?: string;
    recipe?: RecipeItemDto[];
}
