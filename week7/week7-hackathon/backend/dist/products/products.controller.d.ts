import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    create(dto: CreateProductDto): Promise<import("./schemas/product.schema").ProductDocument>;
    findAll(category?: string): Promise<any[]>;
    getCategories(): Promise<string[]>;
    findOne(id: string): Promise<any>;
    update(id: string, dto: UpdateProductDto): Promise<import("./schemas/product.schema").ProductDocument>;
    remove(id: string): Promise<void>;
}
