import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateProvinceDto } from './dto/create-province.dto';
import { UpdateProvinceDto } from './dto/update-province.dto';
import { ProvincesService } from './provinces.service';
 
@ApiTags('provinces')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('provinces')
export class ProvincesController {
  constructor(private readonly provincesService: ProvincesService) {}
 
  @Post()
  create(@Body() dto: CreateProvinceDto) {
    return this.provincesService.create(dto);
  }
 
  @Get()
  findAll() {
    return this.provincesService.findAll();
  }
 
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.provincesService.findOne(id);
  }
 
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProvinceDto) {
    return this.provincesService.update(id, dto);
  }
 
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.provincesService.remove(id);
  }
}
