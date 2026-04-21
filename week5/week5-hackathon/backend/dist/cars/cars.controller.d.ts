import { CarsService } from './cars.service';
export declare class CarsController {
    private readonly carsService;
    constructor(carsService: CarsService);
    getAllCars(query: any): Promise<import("./schemas/car.schema").CarDocument[]>;
    getCarById(id: string): Promise<import("./schemas/car.schema").CarDocument>;
    createCar(req: any, body: any, images: any[]): Promise<import("./schemas/car.schema").CarDocument>;
    getMyCars(req: any): Promise<import("./schemas/car.schema").CarDocument[]>;
}
