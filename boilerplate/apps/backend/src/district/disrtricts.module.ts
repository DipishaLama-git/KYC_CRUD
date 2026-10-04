import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DistrictsController } from './districts.controller';
import { DistrictsService } from './districts.service';
import { District } from './entities/districts.entity';
 
@Module({
  imports: [TypeOrmModule.forFeature([District])],
  controllers: [DistrictsController],
  providers: [DistrictsService],
  exports: [DistrictsService],
})

export class DistrictsModule {}