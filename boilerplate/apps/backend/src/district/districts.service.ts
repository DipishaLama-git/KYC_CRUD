import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDistrictDto } from './dto/create-districts.dto';
import { UpdateDistrictDto } from './dto/update-district.dto';
import { District } from './entities/districts.entity';

@Injectable()
export class DistrictsService {
  constructor(
    @InjectRepository(District)
    private readonly districtsRepository: Repository<District>,
  ) {}

  async create(dto: CreateDistrictDto): Promise<District> {
    const existing = await this.districtsRepository.findOne({
      where: { name: dto.name, provinceId: dto.provinceId },
    });
    if (existing) {
      throw new ConflictException('A district with this name already exists in this province');
    }

  
    const raw = await this.districtsRepository
      .createQueryBuilder('district')
      .select('MAX(district.id)', 'max')
      .getRawOne<{ max: number | null }>();

    const district = this.districtsRepository.create({
      id: (raw?.max ?? 0) + 1,
      name: dto.name,
      provinceId: dto.provinceId,
    });

    return this.districtsRepository.save(district);
  }

  findAll(): Promise<District[]> {
    return this.districtsRepository.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number): Promise<District> {
    const district = await this.districtsRepository.findOne({ where: { id } });
    if (!district) {
      throw new NotFoundException('District not found');
    }
    return district;
  }



  async update(id: number, dto: UpdateDistrictDto): Promise<District> {
    const district = await this.findOne(id);
 
    const nextName = dto.name ?? district.name;
    const nextProvinceId = dto.provinceId ?? district.provinceId;
 
    if (nextName !== district.name || nextProvinceId !== district.provinceId) {
      const existing = await this.districtsRepository.findOne({
        where: { name: nextName, provinceId: nextProvinceId },
      });
      if (existing && existing.id !== id) {
        throw new ConflictException('A district with this name already exists in this province');
      }
    }
 
    district.name = nextName;
    district.provinceId = nextProvinceId;
 
    return this.districtsRepository.save(district);
  }

  async remove(id: number): Promise<void> {
    const district = await this.findOne(id);
    await this.districtsRepository.remove(district);
  }
}