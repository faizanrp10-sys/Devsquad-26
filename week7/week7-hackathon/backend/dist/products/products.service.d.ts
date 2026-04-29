import { Model } from 'mongoose';
import { ProductDocument } from './schemas/product.schema';
import { RawMaterialsService } from '../raw-materials/raw-materials.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductsService {
    private productModel;
    private readonly rawMaterialsService;
    constructor(productModel: Model<ProductDocument>, rawMaterialsService: RawMaterialsService);
    create(dto: CreateProductDto): Promise<ProductDocument>;
    findAll(): Promise<any[]>;
    findByCategory(category: string): Promise<any[]>;
    findById(id: string): Promise<any>;
    update(id: string, dto: UpdateProductDto): Promise<ProductDocument>;
    remove(id: string): Promise<void>;
    getCategories(): Promise<string[]>;
    private calculateAvailableQuantity;
}
