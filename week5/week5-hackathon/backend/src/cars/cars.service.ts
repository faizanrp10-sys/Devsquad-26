import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Car, CarDocument } from './schemas/car.schema';

@Injectable()
export class CarsService {
  constructor(@InjectModel(Car.name) private carModel: Model<CarDocument>) {}

  async create(createData: any, userId: string): Promise<CarDocument> {
    try {
      const carObject = {
        ...createData,
        seller: userId,
        price: Number(createData.price) || 0,
        year: Number(createData.year) || new Date().getFullYear(),
        mileage: Number(createData.mileage) || 0,
        auctionEndTime: createData.auctionEndTime ? new Date(createData.auctionEndTime) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default 7 days
        status: 'active',
      };
      
      console.log('Attempting to create car:', { ...carObject, images: carObject.images?.length });
      
      const newCar = new this.carModel(carObject);
      const savedCar = await newCar.save();
      console.log('Car created successfully:', savedCar._id);
      return savedCar;
    } catch (error) {
      console.error('Error creating car in service:', error);
      throw error;
    }
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

  async payForCar(id: string): Promise<CarDocument> {
    const car = await this.carModel.findByIdAndUpdate(
      id,
      { 
        shippingStatus: 'ready_for_shipping',
        winningDate: new Date(),
        lotNumber: `LOT-${Math.floor(Math.random() * 900000) + 100000}`
      },
      { new: true }
    );
    if (!car) throw new NotFoundException('Car not found');
    return car as CarDocument;
  }

  async updateShippingStatus(id: string, shippingStatus: string): Promise<CarDocument> {
    const update: any = { shippingStatus };
    if (shippingStatus === 'delivered') {
      update.status = 'completed';
    }
    const car = await this.carModel.findByIdAndUpdate(id, update, { new: true });
    if (!car) throw new NotFoundException('Car not found');
    return car as CarDocument;
  }
}
