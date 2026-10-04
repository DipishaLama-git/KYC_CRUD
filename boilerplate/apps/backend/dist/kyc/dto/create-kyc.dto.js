"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateKycDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateKycDto {
    fullName;
    gender;
    dobBs;
    dobAd;
    citizenshipNumber;
    citizenshipIssuedDistrict;
    citizenshipIssuedDate;
    phoneNumber;
    email;
    permanentProvinceId;
    permanentDistrictId;
    permanentMunicipalityId;
    permanentWardNo;
    temporaryProvinceId;
    temporaryDistrictId;
    temporaryMunicipalityId;
    temporaryWardNo;
    fatherName;
    motherName;
    grandfatherName;
    grandmotherName;
    occupation;
    panNumber;
}
exports.CreateKycDto = CreateKycDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Ram Bahadur Thapa' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 200),
    __metadata("design:type", String)
], CreateKycDto.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Male', enum: ['Male', 'Female', 'Other'] }),
    (0, class_validator_1.IsIn)(['Male', 'Female', 'Other']),
    __metadata("design:type", String)
], CreateKycDto.prototype, "gender", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '2047-03-12',
        description: 'Date of birth in Bikram Sambat',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'dobBs must be in YYYY-MM-DD format',
    }),
    __metadata("design:type", String)
], CreateKycDto.prototype, "dobBs", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '1990-06-25', description: 'Date of birth (Gregorian)' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateKycDto.prototype, "dobAd", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '12-34-56-78901' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 50),
    __metadata("design:type", String)
], CreateKycDto.prototype, "citizenshipNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Bhojpur' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 100),
    __metadata("design:type", String)
], CreateKycDto.prototype, "citizenshipIssuedDistrict", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2010-01-15' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateKycDto.prototype, "citizenshipIssuedDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '9801234567' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 20),
    __metadata("design:type", String)
], CreateKycDto.prototype, "phoneNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'ram.thapa@example.com' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateKycDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateKycDto.prototype, "permanentProvinceId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateKycDto.prototype, "permanentDistrictId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateKycDto.prototype, "permanentMunicipalityId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateKycDto.prototype, "permanentWardNo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 3 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateKycDto.prototype, "temporaryProvinceId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 27 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateKycDto.prototype, "temporaryDistrictId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 45 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateKycDto.prototype, "temporaryMunicipalityId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 10 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateKycDto.prototype, "temporaryWardNo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Hari Bahadur Thapa' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 200),
    __metadata("design:type", String)
], CreateKycDto.prototype, "fatherName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Sita Thapa' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 200),
    __metadata("design:type", String)
], CreateKycDto.prototype, "motherName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Krishna Bahadur Thapa' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 200),
    __metadata("design:type", String)
], CreateKycDto.prototype, "grandfatherName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Kamala Thapa' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 200),
    __metadata("design:type", String)
], CreateKycDto.prototype, "grandmotherName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Business' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 100),
    __metadata("design:type", String)
], CreateKycDto.prototype, "occupation", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'ABCDE1234F' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 20),
    __metadata("design:type", String)
], CreateKycDto.prototype, "panNumber", void 0);
//# sourceMappingURL=create-kyc.dto.js.map