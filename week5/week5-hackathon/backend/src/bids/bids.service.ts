import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Bid, BidDocument } from './schemas/bid.schema';
import { CarsService } from '../cars/cars.service';

@Injectable()
export class BidsService {
  constructor(
    @InjectModel(Bid.name) private bidModel: Model<BidDocument>,
    private carsService: CarsService
  ) {}

  async placeBid(carId: string, userId: string, amount: number) {
    const car = await this.carsService.findById(carId);
    if (!car) throw new BadRequestException('Car not found');
    if (car.status !== 'active') throw new BadRequestException('Auction has ended');

    // Server-side validation for bidding on own car
    if ((car.seller as any)._id.toString() === userId) {
      throw new BadRequestException('You cannot bid on your own car');
    }

    if (amount <= car.price) {
      throw new BadRequestException('Bid must be higher than current price');
    }

    const newBid = new this.bidModel({ car: carId, bidder: userId, amount });
    await newBid.save();

    await this.carsService.updatePriceAndWinner(carId, amount, userId);

    const populatedBid = await newBid.populate('bidder', 'name');
    return { bid: populatedBid, car };
  }

  async getBidsForCar(carId: string) {
    return this.bidModel.find({ car: carId }).sort({ amount: -1 }).populate('bidder', 'name').exec();
  }

  async getBidsByUser(userId: string) {
    return this.bidModel.find({ bidder: userId }).populate('car').exec();
  }
}
