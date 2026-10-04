import { CreateProvinceDto } from './dto/create-province.dto';
import { UpdateProvinceDto } from './dto/update-province.dto';
import { ProvincesService } from './provinces.service';
export declare class ProvincesController {
    private readonly provincesService;
    constructor(provincesService: ProvincesService);
    create(dto: CreateProvinceDto): Promise<import("./entity/province.entity").Province>;
    findAll(): Promise<import("./entity/province.entity").Province[]>;
    findOne(id: number): Promise<import("./entity/province.entity").Province>;
    update(id: number, dto: UpdateProvinceDto): Promise<import("./entity/province.entity").Province>;
    remove(id: number): Promise<void>;
}
