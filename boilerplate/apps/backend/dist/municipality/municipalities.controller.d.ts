import { CreateMunicipalityDto } from './dto/create-municipality.dto';
import { UpdateMunicipalityDto } from './dto/update-municipality.dto';
import { MunicipalitiesService } from './municipalities.service';
export declare class MunicipalitiesController {
    private readonly municipalitiesService;
    constructor(municipalitiesService: MunicipalitiesService);
    create(dto: CreateMunicipalityDto): Promise<import("./entity/municipality.entity").Municipality>;
    findAll(): Promise<import("./entity/municipality.entity").Municipality[]>;
    findOne(id: number): Promise<import("./entity/municipality.entity").Municipality>;
    update(id: number, dto: UpdateMunicipalityDto): Promise<import("./entity/municipality.entity").Municipality>;
    remove(id: number): Promise<void>;
}
