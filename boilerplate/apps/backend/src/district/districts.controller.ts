import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DistrictsService } from './districts.service';
import { CreateDistrictDto } from './dto/create-districts.dto';
import { UpdateDistrictDto } from './dto/update-district.dto';
@ApiTags('districts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('districts')
export class DistrictsController {
  constructor(private readonly districtsService: DistrictsService) {}
 
  @Post()
  create(@Body() dto: CreateDistrictDto) {
    return this.districtsService.create(dto);
  }
 
  @Get()
  findAll() {
    return this.districtsService.findAll();
  }
 
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.districtsService.findOne(id);
  }
  

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateDistrictDto) {
    return this.districtsService.update(id, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.districtsService.remove(id);
  }

} 