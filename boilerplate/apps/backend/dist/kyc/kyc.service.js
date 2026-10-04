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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KycService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const nepali_date_converter_1 = require("@sbmdkl/nepali-date-converter");
const create_kyc_dto_1 = require("./dto/create-kyc.dto");
const kyc_entity_1 = require("./entity/kyc.entity");
const province_entity_1 = require("../province/entity/province.entity");
const districts_entity_1 = require("../district/entities/districts.entity");
const municipality_entity_1 = require("../municipality/entity/municipality.entity");
let KycService = class KycService {
    kycRepository;
    provinceRepository;
    districtRepository;
    municipalityRepository;
    constructor(kycRepository, provinceRepository, districtRepository, municipalityRepository) {
        this.kycRepository = kycRepository;
        this.provinceRepository = provinceRepository;
        this.districtRepository = districtRepository;
        this.municipalityRepository = municipalityRepository;
    }
    async validateAddressHierarchy(label, provinceId, districtId, municipalityId) {
        const [province, district, municipality] = await Promise.all([
            this.provinceRepository.findOne({ where: { id: provinceId } }),
            this.districtRepository.findOne({ where: { id: districtId } }),
            this.municipalityRepository.findOne({ where: { id: municipalityId } }),
        ]);
        if (!province) {
            throw new common_1.BadRequestException(`${label} address: province not found`);
        }
        if (!district) {
            throw new common_1.BadRequestException(`${label} address: district not found`);
        }
        if (!municipality) {
            throw new common_1.BadRequestException(`${label} address: municipality not found`);
        }
        if (district.provinceId !== provinceId) {
            throw new common_1.BadRequestException(`${label} address: selected district does not belong to the selected province`);
        }
        if (municipality.districtId !== districtId) {
            throw new common_1.BadRequestException(`${label} address: selected municipality does not belong to the selected district`);
        }
    }
    validateDob(dobBs, dobAd) {
        if (!dobBs) {
            return;
        }
        try {
            const calculatedBs = (0, nepali_date_converter_1.adToBs)(dobAd);
            if (calculatedBs !== dobBs) {
                throw new common_1.BadRequestException('BS and AD date of birth do not match');
            }
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.BadRequestException('Invalid date of birth');
        }
    }
    async create(dto, actor) {
        this.validateDob(dto.dobBs, dto.dobAd);
        await this.validateAddressHierarchy('Permanent', dto.permanentProvinceId, dto.permanentDistrictId, dto.permanentMunicipalityId);
        if (dto.temporaryProvinceId ||
            dto.temporaryDistrictId ||
            dto.temporaryMunicipalityId) {
            if (!dto.temporaryProvinceId ||
                !dto.temporaryDistrictId ||
                !dto.temporaryMunicipalityId) {
                throw new common_1.BadRequestException('Temporary address requires province, district and municipality together');
            }
            await this.validateAddressHierarchy('Temporary', dto.temporaryProvinceId, dto.temporaryDistrictId, dto.temporaryMunicipalityId);
        }
        const existing = await this.kycRepository.findOne({
            where: {
                citizenshipNumber: dto.citizenshipNumber,
            },
        });
        if (existing) {
            throw new common_1.ConflictException('A KYC record with this citizenship number already exists');
        }
        const record = this.kycRepository.create({
            fullName: dto.fullName,
            gender: dto.gender,
            dobBs: dto.dobBs ?? null,
            dobAd: dto.dobAd,
            citizenshipNumber: dto.citizenshipNumber,
            citizenshipIssuedDistrict: dto.citizenshipIssuedDistrict ?? null,
            citizenshipIssuedDate: dto.citizenshipIssuedDate ?? null,
            phoneNumber: dto.phoneNumber,
            email: dto.email ?? null,
            permanentProvinceId: dto.permanentProvinceId,
            permanentDistrictId: dto.permanentDistrictId,
            permanentMunicipalityId: dto.permanentMunicipalityId,
            permanentWardNo: dto.permanentWardNo,
            temporaryProvinceId: dto.temporaryProvinceId ?? null,
            temporaryDistrictId: dto.temporaryDistrictId ?? null,
            temporaryMunicipalityId: dto.temporaryMunicipalityId ?? null,
            temporaryWardNo: dto.temporaryWardNo ?? null,
            fatherName: dto.fatherName ?? null,
            motherName: dto.motherName ?? null,
            grandfatherName: dto.grandfatherName ?? null,
            grandmotherName: dto.grandmotherName ?? null,
            occupation: dto.occupation ?? null,
            panNumber: dto.panNumber ?? null,
            imageUrl: null,
            createdBy: actor,
            lastUpdatedBy: actor,
        });
        return this.kycRepository.save(record);
    }
    async importFromCsv(buffer, actor) {
        const rows = this.parseCsv(buffer.toString('utf-8'));
        if (rows.length === 0) {
            return {
                totalRows: 0,
                successCount: 0,
                failedCount: 0,
                errors: [],
            };
        }
        const [header, ...dataRows] = rows;
        const columns = header.map((column) => column.trim());
        const errors = [];
        let successCount = 0;
        let totalRows = 0;
        for (let i = 0; i < dataRows.length; i++) {
            const values = dataRows[i];
            if (values.every((value) => value.trim() === '')) {
                continue;
            }
            totalRows++;
            const rowNumber = i + 2;
            const record = {};
            columns.forEach((column, index) => {
                record[column] = (values[index] ?? '').trim();
            });
            try {
                const dto = this.mapCsvRowToDto(record);
                await this.create(dto, actor);
                successCount++;
            }
            catch (error) {
                const message = error instanceof Error
                    ? error.message
                    : 'Invalid row';
                errors.push({ row: rowNumber, message });
            }
        }
        return {
            totalRows,
            successCount,
            failedCount: errors.length,
            errors,
        };
    }
    mapCsvRowToDto(row) {
        const toOptionalInt = (value) => {
            if (!value) {
                return undefined;
            }
            const parsed = Number(value);
            if (!Number.isFinite(parsed)) {
                throw new common_1.BadRequestException(`Invalid number: "${value}"`);
            }
            return parsed;
        };
        const missing = [];
        if (!row.full_name)
            missing.push('full_name');
        if (!row.gender)
            missing.push('gender');
        if (!row.dob_ad)
            missing.push('dob_ad');
        if (!row.citizenship_number)
            missing.push('citizenship_number');
        if (!row.phone_number)
            missing.push('phone_number');
        if (!row.permanent_province_id)
            missing.push('permanent_province_id');
        if (!row.permanent_district_id)
            missing.push('permanent_district_id');
        if (!row.permanent_municipality_id)
            missing.push('permanent_municipality_id');
        if (!row.permanent_ward_no)
            missing.push('permanent_ward_no');
        if (missing.length > 0) {
            throw new common_1.BadRequestException(`Missing required field(s): ${missing.join(', ')}`);
        }
        if (!['Male', 'Female', 'Other'].includes(row.gender)) {
            throw new common_1.BadRequestException(`Invalid gender: "${row.gender}" (expected Male, Female or Other)`);
        }
        const dto = new create_kyc_dto_1.CreateKycDto();
        dto.fullName = row.full_name;
        dto.gender = row.gender;
        dto.dobBs = row.dob_bs || undefined;
        dto.dobAd = row.dob_ad;
        dto.citizenshipNumber = row.citizenship_number;
        dto.citizenshipIssuedDistrict = row.citizenship_issued_district || undefined;
        dto.citizenshipIssuedDate = row.citizenship_issued_date || undefined;
        dto.phoneNumber = row.phone_number;
        dto.email = row.email || undefined;
        dto.permanentProvinceId = toOptionalInt(row.permanent_province_id);
        dto.permanentDistrictId = toOptionalInt(row.permanent_district_id);
        dto.permanentMunicipalityId = toOptionalInt(row.permanent_municipality_id);
        dto.permanentWardNo = toOptionalInt(row.permanent_ward_no);
        dto.temporaryProvinceId = toOptionalInt(row.temporary_province_id);
        dto.temporaryDistrictId = toOptionalInt(row.temporary_district_id);
        dto.temporaryMunicipalityId = toOptionalInt(row.temporary_municipality_id);
        dto.temporaryWardNo = toOptionalInt(row.temporary_ward_no);
        dto.fatherName = row.father_name || undefined;
        dto.motherName = row.mother_name || undefined;
        dto.grandfatherName = row.grandfather_name || undefined;
        dto.grandmotherName = row.grandmother_name || undefined;
        dto.occupation = row.occupation || undefined;
        dto.panNumber = row.pan_number || undefined;
        return dto;
    }
    parseCsv(text) {
        const content = text.replace(/\r\n/g, '\n').replace(/^\uFEFF/, '');
        const rows = [];
        let row = [];
        let field = '';
        let inQuotes = false;
        const pushField = () => {
            row.push(field);
            field = '';
        };
        const pushRow = () => {
            pushField();
            rows.push(row);
            row = [];
        };
        for (let i = 0; i < content.length; i++) {
            const char = content[i];
            if (inQuotes) {
                if (char === '"') {
                    if (content[i + 1] === '"') {
                        field += '"';
                        i++;
                    }
                    else {
                        inQuotes = false;
                    }
                }
                else {
                    field += char;
                }
                continue;
            }
            if (char === '"') {
                inQuotes = true;
                continue;
            }
            if (char === ',') {
                pushField();
                continue;
            }
            if (char === '\n') {
                pushRow();
                continue;
            }
            field += char;
        }
        if (field.length > 0 || row.length > 0) {
            pushRow();
        }
        return rows.filter((currentRow) => !(currentRow.length === 1 && currentRow[0] === ''));
    }
    findAll() {
        return this.kycRepository.find({
            order: {
                createdDate: 'DESC',
            },
        });
    }
    async findOne(id) {
        const record = await this.kycRepository.findOne({
            where: { id },
        });
        if (!record) {
            throw new common_1.NotFoundException('KYC record not found');
        }
        return record;
    }
    async update(id, dto, actor) {
        const record = await this.findOne(id);
        const dobBs = dto.dobBs !== undefined
            ? dto.dobBs
            : record.dobBs;
        const dobAd = dto.dobAd !== undefined
            ? dto.dobAd
            : record.dobAd;
        this.validateDob(dobBs ?? undefined, dobAd);
        const finalPermanentProvinceId = dto.permanentProvinceId ?? record.permanentProvinceId;
        const finalPermanentDistrictId = dto.permanentDistrictId ?? record.permanentDistrictId;
        const finalPermanentMunicipalityId = dto.permanentMunicipalityId ?? record.permanentMunicipalityId;
        await this.validateAddressHierarchy('Permanent', finalPermanentProvinceId, finalPermanentDistrictId, finalPermanentMunicipalityId);
        const finalTemporaryProvinceId = dto.temporaryProvinceId === undefined
            ? record.temporaryProvinceId
            : dto.temporaryProvinceId;
        const finalTemporaryDistrictId = dto.temporaryDistrictId === undefined
            ? record.temporaryDistrictId
            : dto.temporaryDistrictId;
        const finalTemporaryMunicipalityId = dto.temporaryMunicipalityId === undefined
            ? record.temporaryMunicipalityId
            : dto.temporaryMunicipalityId;
        if (finalTemporaryProvinceId ||
            finalTemporaryDistrictId ||
            finalTemporaryMunicipalityId) {
            if (!finalTemporaryProvinceId ||
                !finalTemporaryDistrictId ||
                !finalTemporaryMunicipalityId) {
                throw new common_1.BadRequestException('Temporary address requires province, district and municipality together');
            }
            await this.validateAddressHierarchy('Temporary', finalTemporaryProvinceId, finalTemporaryDistrictId, finalTemporaryMunicipalityId);
        }
        Object.assign(record, {
            fullName: dto.fullName ??
                record.fullName,
            gender: dto.gender ??
                record.gender,
            dobBs: dto.dobBs === undefined
                ? record.dobBs
                : dto.dobBs,
            dobAd: dto.dobAd ??
                record.dobAd,
            citizenshipIssuedDistrict: dto.citizenshipIssuedDistrict ===
                undefined
                ? record.citizenshipIssuedDistrict
                : dto.citizenshipIssuedDistrict,
            citizenshipIssuedDate: dto.citizenshipIssuedDate ===
                undefined
                ? record.citizenshipIssuedDate
                : dto.citizenshipIssuedDate,
            phoneNumber: dto.phoneNumber ??
                record.phoneNumber,
            email: dto.email === undefined
                ? record.email
                : dto.email,
            permanentProvinceId: dto.permanentProvinceId ??
                record.permanentProvinceId,
            permanentDistrictId: dto.permanentDistrictId ??
                record.permanentDistrictId,
            permanentMunicipalityId: dto.permanentMunicipalityId ??
                record.permanentMunicipalityId,
            permanentWardNo: dto.permanentWardNo ??
                record.permanentWardNo,
            temporaryProvinceId: dto.temporaryProvinceId ===
                undefined
                ? record.temporaryProvinceId
                : dto.temporaryProvinceId,
            temporaryDistrictId: dto.temporaryDistrictId ===
                undefined
                ? record.temporaryDistrictId
                : dto.temporaryDistrictId,
            temporaryMunicipalityId: dto.temporaryMunicipalityId ===
                undefined
                ? record.temporaryMunicipalityId
                : dto.temporaryMunicipalityId,
            temporaryWardNo: dto.temporaryWardNo ===
                undefined
                ? record.temporaryWardNo
                : dto.temporaryWardNo,
            fatherName: dto.fatherName === undefined
                ? record.fatherName
                : dto.fatherName,
            motherName: dto.motherName === undefined
                ? record.motherName
                : dto.motherName,
            grandfatherName: dto.grandfatherName === undefined
                ? record.grandfatherName
                : dto.grandfatherName,
            grandmotherName: dto.grandmotherName === undefined
                ? record.grandmotherName
                : dto.grandmotherName,
            occupation: dto.occupation === undefined
                ? record.occupation
                : dto.occupation,
            panNumber: dto.panNumber === undefined
                ? record.panNumber
                : dto.panNumber,
            lastUpdatedBy: actor,
        });
        return this.kycRepository.save(record);
    }
    async uploadImage(id, file, actor) {
        if (!file) {
            throw new common_1.BadRequestException('Image is required');
        }
        const record = await this.findOne(id);
        record.imageUrl =
            `/uploads/kyc/${file.filename}`;
        record.lastUpdatedBy = actor;
        return this.kycRepository.save(record);
    }
    async remove(id) {
        const record = await this.findOne(id);
        await this.kycRepository.remove(record);
    }
};
exports.KycService = KycService;
exports.KycService = KycService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(kyc_entity_1.Kyc)),
    __param(1, (0, typeorm_1.InjectRepository)(province_entity_1.Province)),
    __param(2, (0, typeorm_1.InjectRepository)(districts_entity_1.District)),
    __param(3, (0, typeorm_1.InjectRepository)(municipality_entity_1.Municipality)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], KycService);
//# sourceMappingURL=kyc.service.js.map