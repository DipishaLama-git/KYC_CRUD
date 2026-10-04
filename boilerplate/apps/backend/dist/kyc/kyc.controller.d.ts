import type { AuthenticatedUser } from '../auth/decorators/current-user.decorator';
import { CreateKycDto } from './dto/create-kyc.dto';
import { UpdateKycDto } from './dto/update-kyc.dto';
import { KycService } from './kyc.service';
export declare class KycController {
    private readonly kycService;
    constructor(kycService: KycService);
    create(dto: CreateKycDto, currentUser: AuthenticatedUser): Promise<import("./entity/kyc.entity").Kyc>;
    importCsv(file: Express.Multer.File, currentUser: AuthenticatedUser): Promise<{
        totalRows: number;
        successCount: number;
        failedCount: number;
        errors: {
            row: number;
            message: string;
        }[];
    }>;
    findAll(): Promise<import("./entity/kyc.entity").Kyc[]>;
    findOne(id: string): Promise<import("./entity/kyc.entity").Kyc>;
    update(id: string, dto: UpdateKycDto, currentUser: AuthenticatedUser): Promise<import("./entity/kyc.entity").Kyc>;
    uploadImage(id: string, file: Express.Multer.File, currentUser: AuthenticatedUser): Promise<import("./entity/kyc.entity").Kyc>;
    remove(id: string): Promise<void>;
}
