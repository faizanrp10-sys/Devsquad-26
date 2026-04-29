import { RawMaterialsService } from './raw-materials.service';
import { CreateRawMaterialDto } from './dto/create-raw-material.dto';
import { UpdateRawMaterialDto } from './dto/update-raw-material.dto';
export declare class RawMaterialsController {
    private readonly rawMaterialsService;
    constructor(rawMaterialsService: RawMaterialsService);
    create(dto: CreateRawMaterialDto): Promise<import("./schemas/raw-material.schema").RawMaterialDocument>;
    findAll(): Promise<import("./schemas/raw-material.schema").RawMaterialDocument[]>;
    getLowStock(): Promise<import("./schemas/raw-material.schema").RawMaterialDocument[]>;
    findOne(id: string): Promise<import("./schemas/raw-material.schema").RawMaterialDocument>;
    update(id: string, dto: UpdateRawMaterialDto): Promise<import("./schemas/raw-material.schema").RawMaterialDocument>;
    remove(id: string): Promise<void>;
}
