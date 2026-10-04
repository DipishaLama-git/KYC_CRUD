import { Repository } from 'typeorm';
import { CreateDistrictDto } from './dto/create-districts.dto';
import { UpdateDistrictDto } from './dto/update-district.dto';
import { District } from './entities/districts.entity';
export declare class DistrictsService {
    private readonly districtsRepository;
    constructor(districtsRepository: Repository<District>);
    create(dto: CreateDistrictDto): Promise<District>;
    findAll(): Promise<District[]>;
    findOne(id: number): Promise<District>;
    update(id: number, dto: UpdateDistrictDto): Promise<District>;
    remove(id: number): Promise<void>;
}
