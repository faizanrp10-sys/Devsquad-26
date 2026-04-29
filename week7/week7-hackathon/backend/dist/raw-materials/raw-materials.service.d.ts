import { Model } from 'mongoose';
import { RawMaterialDocument } from './schemas/raw-material.schema';
import { CreateRawMaterialDto } from './dto/create-raw-material.dto';
import { UpdateRawMaterialDto } from './dto/update-raw-material.dto';
export declare class RawMaterialsService {
    private rawMaterialModel;
    constructor(rawMaterialModel: Model<RawMaterialDocument>);
    create(dto: CreateRawMaterialDto): Promise<RawMaterialDocument>;
    findAll(): Promise<RawMaterialDocument[]>;
    findById(id: string): Promise<RawMaterialDocument>;
    update(id: string, dto: UpdateRawMaterialDto): Promise<RawMaterialDocument>;
    remove(id: string): Promise<void>;
    getLowStock(): Promise<RawMaterialDocument[]>;
    deductStock(id: string, amount: number): Promise<RawMaterialDocument>;
}
