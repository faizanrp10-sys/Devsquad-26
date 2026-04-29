export declare class RecipeItemDto {
    materialId: string;
    quantity: number;
}
export declare class CreateProductDto {
    name: string;
    price: number;
    image?: string;
    category?: string;
    recipe?: RecipeItemDto[];
}
