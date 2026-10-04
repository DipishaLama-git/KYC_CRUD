import { DistrictsService } from './districts.service';
import { CreateDistrictDto } from './dto/create-districts.dto';
import { UpdateDistrictDto } from './dto/update-district.dto';
export declare class DistrictsController {
    private readonly districtsService;
    constructor(districtsService: DistrictsService);
    create(dto: CreateDistrictDto): Promise<import("./entities/districts.entity").District>;
    findAll(): Promise<import("./entities/districts.entity").District[]>;
    findOne(id: number): Promise<import("./entities/districts.entity").District>;
    update(id: number, dto: UpdateDistrictDto): Promise<import("./entities/districts.entity").District>;
    remove(id: number): Promise<void>;
}
