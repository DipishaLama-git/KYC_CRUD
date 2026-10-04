import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Kyc } from './entity/kyc.entity';
import { KycController } from './kyc.controller';
import { KycService } from './kyc.service';
import { Province } from '../province/entity/province.entity';
import { District } from '../district/entities/districts.entity';
import { Municipality } from '../municipality/entity/municipality.entity';
 
@Module({
  imports: [TypeOrmModule.forFeature([Kyc, Province, District, Municipality])],
  controllers: [KycController],
  providers: [KycService],
  exports: [KycService],
})
export class KycModule {}