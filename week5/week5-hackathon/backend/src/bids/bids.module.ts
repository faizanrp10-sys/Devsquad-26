import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Bid, BidSchema } from './schemas/bid.schema';
import { BidsService } from './bids.service';
import { BidsController } from './bids.controller';
import { BidGateway } from './bid.gateway';
import { CarsModule } from '../cars/cars.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Bid.name, schema: BidSchema }]),
    CarsModule
  ],
  controllers: [BidsController],
  providers: [BidsService, BidGateway],
  exports: [BidsService]
})
export class BidsModule {}
