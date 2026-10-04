import { CreateKycDto } from './create-kyc.dto';
declare const UpdateKycDto_base: import("@nestjs/common").Type<Partial<Omit<CreateKycDto, "citizenshipNumber">>>;
export declare class UpdateKycDto extends UpdateKycDto_base {
}
export {};
