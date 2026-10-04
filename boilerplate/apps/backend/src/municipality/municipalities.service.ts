import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMunicipalityDto } from './dto/create-municipality.dto';
import { UpdateMunicipalityDto } from './dto/update-municipality.dto';
import { Municipality } from './entity/municipality.entity';
 
@Injectable()
export class MunicipalitiesService {
  constructor(
    @InjectRepository(Municipality)
    private readonly municipalitiesRepository: Repository<Municipality>,
  ) {}
 
  async create(dto: CreateMunicipalityDto): Promise<Municipality> {
    const existing = await this.municipalitiesRepository.findOne({
      where: { name: dto.name, districtId: dto.districtId },
    });
    if (existing) {
      throw new ConflictException('A municipality with this name already exists in this district');
    }
 
    // id is a plain integer primary key (not auto-incrementing in the DB),
    // so the next id has to be computed here.
    const raw = await this.municipalitiesRepository
      .createQueryBuilder('municipality')
      .select('MAX(municipality.id)', 'max')
      .getRawOne<{ max: number | null }>();
 
    const municipality = this.municipalitiesRepository.create({
      id: (raw?.max ?? 0) + 1,
      name: dto.name,
      districtId: dto.districtId,
    });
 
    return this.municipalitiesRepository.save(municipality);
  }
 
  findAll(): Promise<Municipality[]> {
    return this.municipalitiesRepository.find({ order: { id: 'ASC' } });
  }
 
  async findOne(id: number): Promise<Municipality> {
    const municipality = await this.municipalitiesRepository.findOne({ where: { id } });
    if (!municipality) {
      throw new NotFoundException('Municipality not found');
    }
    return municipality;
  }
 
  async update(id: number, dto: UpdateMunicipalityDto): Promise<Municipality> {
    const municipality = await this.findOne(id);
 
    const nextName = dto.name ?? municipality.name;
    const nextDistrictId = dto.districtId ?? municipality.districtId;
 
    if (nextName !== municipality.name || nextDistrictId !== municipality.districtId) {
      const existing = await this.municipalitiesRepository.findOne({
        where: { name: nextName, districtId: nextDistrictId },
      });
      if (existing && existing.id !== id) {
        throw new ConflictException('A municipality with this name already exists in this district');
      }
    }
 
    municipality.name = nextName;
    municipality.districtId = nextDistrictId;
 
    return this.municipalitiesRepository.save(municipality);
  }
 
  async remove(id: number): Promise<void> {
    const municipality = await this.findOne(id);
    await this.municipalitiesRepository.remove(municipality);
  }

}