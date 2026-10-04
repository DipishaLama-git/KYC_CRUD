import { Repository } from 'typeorm';
import { CreateKycDto } from './dto/create-kyc.dto';
import { UpdateKycDto } from './dto/update-kyc.dto';
import { Kyc } from './entity/kyc.entity';
import { Province } from '../province/entity/province.entity';
import { District } from '../district/entities/districts.entity';
import { Municipality } from '../municipality/entity/municipality.entity';
export declare class KycService {
    private readonly kycRepository;
    private readonly provinceRepository;
    private readonly districtRepository;
    private readonly municipalityRepository;
    constructor(kycRepository: Repository<Kyc>, provinceRepository: Repository<Province>, districtRepository: Repository<District>, municipalityRepository: Repository<Municipality>);
    private validateAddressHierarchy;
    private validateDob;
    create(dto: CreateKycDto, actor: string): Promise<Kyc>;
    importFromCsv(buffer: Buffer, actor: string): Promise<{
        totalRows: number;
        successCount: number;
        failedCount: number;
        errors: {
            row: number;
            message: string;
        }[];
    }>;
    private mapCsvRowToDto;
    private parseCsv;
    findAll(): Promise<Kyc[]>;
    findOne(id: string): Promise<Kyc>;
    update(id: string, dto: UpdateKycDto, actor: string): Promise<Kyc>;
    uploadImage(id: string, file: Express.Multer.File, actor: string): Promise<Kyc>;
    remove(id: string): Promise<void>;
}
