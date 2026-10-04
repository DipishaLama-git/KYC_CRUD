import { Repository } from 'typeorm';
import { CreateMunicipalityDto } from './dto/create-municipality.dto';
import { UpdateMunicipalityDto } from './dto/update-municipality.dto';
import { Municipality } from './entity/municipality.entity';
export declare class MunicipalitiesService {
    private readonly municipalitiesRepository;
    constructor(municipalitiesRepository: Repository<Municipality>);
    create(dto: CreateMunicipalityDto): Promise<Municipality>;
    findAll(): Promise<Municipality[]>;
    findOne(id: number): Promise<Municipality>;
    update(id: number, dto: UpdateMunicipalityDto): Promise<Municipality>;
    remove(id: number): Promise<void>;
}
