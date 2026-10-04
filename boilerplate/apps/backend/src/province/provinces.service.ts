import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProvinceDto } from './dto/create-province.dto';
import { UpdateProvinceDto } from './dto/update-province.dto';
import { Province } from './entity/province.entity';
 
@Injectable()
export class ProvincesService {
  constructor(
    @InjectRepository(Province)
    private readonly provincesRepository: Repository<Province>,
  ) {}
 
  async create(dto: CreateProvinceDto): Promise<Province> {
    const existing = await this.provincesRepository.findOne({ where: { name: dto.name } });
    if (existing) {
      throw new ConflictException('A province with this name already exists');
    }
 
    // id is a plain integer primary key (not auto-incrementing in the DB),
    // so the next id has to be computed here.
    const raw = await this.provincesRepository
      .createQueryBuilder('province')
      .select('MAX(province.id)', 'max')
      .getRawOne<{ max: number | null }>();
 
    const province = this.provincesRepository.create({
      id: (raw?.max ?? 0) + 1,
      name: dto.name,
    });
 
    return this.provincesRepository.save(province);
  }
 
  findAll(): Promise<Province[]> {
    return this.provincesRepository.find({ order: { id: 'ASC' } });
  }
 
  async findOne(id: number): Promise<Province> {
    const province = await this.provincesRepository.findOne({ where: { id } });
    if (!province) {
      throw new NotFoundException('Province not found');
    }
    return province;
  }
 
  async update(id: number, dto: UpdateProvinceDto): Promise<Province> {
    const province = await this.findOne(id);
 
    if (dto.name && dto.name !== province.name) {
      const existing = await this.provincesRepository.findOne({ where: { name: dto.name } });
      if (existing && existing.id !== id) {
        throw new ConflictException('A province with this name already exists');
      }
      province.name = dto.name;
    }
 
    return this.provincesRepository.save(province);
  }
 
  async remove(id: number): Promise<void> {
    const province = await this.findOne(id);
    await this.provincesRepository.remove(province);
  }
}