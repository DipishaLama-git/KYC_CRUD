import { Repository } from 'typeorm';
import { CreateProvinceDto } from './dto/create-province.dto';
import { UpdateProvinceDto } from './dto/update-province.dto';
import { Province } from './entity/province.entity';
export declare class ProvincesService {
    private readonly provincesRepository;
    constructor(provincesRepository: Repository<Province>);
    create(dto: CreateProvinceDto): Promise<Province>;
    findAll(): Promise<Province[]>;
    findOne(id: number): Promise<Province>;
    update(id: number, dto: UpdateProvinceDto): Promise<Province>;
    remove(id: number): Promise<void>;
}
