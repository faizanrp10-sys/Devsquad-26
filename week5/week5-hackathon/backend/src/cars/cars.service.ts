import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Car, CarDocument } from './schemas/car.schema';

@Injectable()
export class CarsService {
  constructor(@InjectModel(Car.name) private carModel: Model<CarDocument>) {}

  async create(createData: any, userId: string): Promise<CarDocument> {
    const newCar = new this.carModel({ ...createData, seller: userId });
    return newCar.save();
  }

  async findAll(query: any): Promise<CarDocument[]> {
    const filter: any = {};
    if (query.make) filter.make = new RegExp(query.make, 'i');
    if (query.model) filter.model = new RegExp(query.model, 'i');
    if (query.year) filter.year = Number(query.year);
    if (query.bodyType) filter.bodyType = query.bodyType;
    if (query.status) filter.status = query.status;

    return this.carModel.find(filter).populate('seller', 'name').exec();
  }

  async findById(id: string): Promise<CarDocument> {
    const car = await this.carModel.findById(id).populate('seller', 'name').exec();
    if (!car) throw new NotFoundException('Car not found');
    return car;
  }

  async updatePriceAndWinner(id: string, newPrice: number, winnerId?: string) {
    const updatePayload: any = { price: newPrice };
    if (winnerId) {
      updatePayload.winner = winnerId;
    }
    return this.carModel.findByIdAndUpdate(id, updatePayload, { new: true });
  }

  async updateStatus(id: string, status: string) {
    return this.carModel.findByIdAndUpdate(id, { status }, { new: true });
  }

  async findBySeller(userId: string): Promise<CarDocument[]> {
    return this.carModel.find({ seller: userId }).exec();
  }
}
