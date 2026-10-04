import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateKycDto } from './create-kyc.dto';




export class UpdateKycDto extends PartialType(OmitType(CreateKycDto, ['citizenshipNumber'] as const)) {}