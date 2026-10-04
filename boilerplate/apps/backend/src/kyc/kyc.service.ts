import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { adToBs } from '@sbmdkl/nepali-date-converter';

import { CreateKycDto } from './dto/create-kyc.dto';
import { UpdateKycDto } from './dto/update-kyc.dto';
import { Kyc } from './entity/kyc.entity';
import { Province } from '../province/entity/province.entity';
import { District } from '../district/entities/districts.entity';
import { Municipality } from '../municipality/entity/municipality.entity';

@Injectable()
export class KycService {
  constructor(
    @InjectRepository(Kyc)
    private readonly kycRepository: Repository<Kyc>,

    @InjectRepository(Province)
    private readonly provinceRepository: Repository<Province>,

    @InjectRepository(District)
    private readonly districtRepository: Repository<District>,

    @InjectRepository(Municipality)
    private readonly municipalityRepository: Repository<Municipality>,
  ) {}

  // --------------------------------------------------
  // Validate that district belongs to province and
  // municipality belongs to district. Prevents saving
  // an address whose province/district/municipality
  // don't actually form a valid Nepal geography chain.
  // --------------------------------------------------
  private async validateAddressHierarchy(
    label: 'Permanent' | 'Temporary',
    provinceId: number,
    districtId: number,
    municipalityId: number,
  ): Promise<void> {
    const [province, district, municipality] = await Promise.all([
      this.provinceRepository.findOne({ where: { id: provinceId } }),
      this.districtRepository.findOne({ where: { id: districtId } }),
      this.municipalityRepository.findOne({ where: { id: municipalityId } }),
    ]);

    if (!province) {
      throw new BadRequestException(`${label} address: province not found`);
    }

    if (!district) {
      throw new BadRequestException(`${label} address: district not found`);
    }

    if (!municipality) {
      throw new BadRequestException(`${label} address: municipality not found`);
    }

    if (district.provinceId !== provinceId) {
      throw new BadRequestException(
        `${label} address: selected district does not belong to the selected province`,
      );
    }

    if (municipality.districtId !== districtId) {
      throw new BadRequestException(
        `${label} address: selected municipality does not belong to the selected district`,
      );
    }
  }

  // --------------------------------------------------
  // Validate BS and AD date of birth
  // --------------------------------------------------
  private validateDob(
    dobBs: string | undefined,
    dobAd: string,
  ): void {
    // BS is optional
    if (!dobBs) {
      return;
    }

    try {
      const calculatedBs = adToBs(dobAd);

      if (calculatedBs !== dobBs) {
        throw new BadRequestException(
          'BS and AD date of birth do not match',
        );
      }
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new BadRequestException(
        'Invalid date of birth',
      );
    }
  }

  // --------------------------------------------------
  // Create KYC
  // --------------------------------------------------
  async create(
    dto: CreateKycDto,
    actor: string,
  ): Promise<Kyc> {
    // Validate BS and AD DOB
    this.validateDob(
      dto.dobBs,
      dto.dobAd,
    );

    // Validate permanent address chain (required)
    await this.validateAddressHierarchy(
      'Permanent',
      dto.permanentProvinceId,
      dto.permanentDistrictId,
      dto.permanentMunicipalityId,
    );

    // Validate temporary address chain (optional, only if provided)
    if (
      dto.temporaryProvinceId ||
      dto.temporaryDistrictId ||
      dto.temporaryMunicipalityId
    ) {
      if (
        !dto.temporaryProvinceId ||
        !dto.temporaryDistrictId ||
        !dto.temporaryMunicipalityId
      ) {
        throw new BadRequestException(
          'Temporary address requires province, district and municipality together',
        );
      }

      await this.validateAddressHierarchy(
        'Temporary',
        dto.temporaryProvinceId,
        dto.temporaryDistrictId,
        dto.temporaryMunicipalityId,
      );
    }

    // Check duplicate citizenship number
    const existing =
      await this.kycRepository.findOne({
        where: {
          citizenshipNumber:
            dto.citizenshipNumber,
        },
      });

    if (existing) {
      throw new ConflictException(
        'A KYC record with this citizenship number already exists',
      );
    }

    const record =
      this.kycRepository.create({
        fullName: dto.fullName,
        gender: dto.gender,

        dobBs:
          dto.dobBs ?? null,

        dobAd:
          dto.dobAd,

        citizenshipNumber:
          dto.citizenshipNumber,

        citizenshipIssuedDistrict:
          dto.citizenshipIssuedDistrict ?? null,

        citizenshipIssuedDate:
          dto.citizenshipIssuedDate ?? null,

        phoneNumber:
          dto.phoneNumber,

        email:
          dto.email ?? null,

        // Permanent address
        permanentProvinceId:
          dto.permanentProvinceId,

        permanentDistrictId:
          dto.permanentDistrictId,

        permanentMunicipalityId:
          dto.permanentMunicipalityId,

        permanentWardNo:
          dto.permanentWardNo,

        // Temporary address
        temporaryProvinceId:
          dto.temporaryProvinceId ?? null,

        temporaryDistrictId:
          dto.temporaryDistrictId ?? null,

        temporaryMunicipalityId:
          dto.temporaryMunicipalityId ?? null,

        temporaryWardNo:
          dto.temporaryWardNo ?? null,

        // Family details
        fatherName:
          dto.fatherName ?? null,

        motherName:
          dto.motherName ?? null,

        grandfatherName:
          dto.grandfatherName ?? null,

        grandmotherName:
          dto.grandmotherName ?? null,

        // Other details
        occupation:
          dto.occupation ?? null,

        panNumber:
          dto.panNumber ?? null,

        // No image when creating KYC
        imageUrl: null,

        // Audit
        createdBy: actor,
        lastUpdatedBy: actor,
      });

    return this.kycRepository.save(record);
  }

  // --------------------------------------------------
  // Import KYC records from CSV
  // --------------------------------------------------
  async importFromCsv(
    buffer: Buffer,
    actor: string,
  ): Promise<{
    totalRows: number;
    successCount: number;
    failedCount: number;
    errors: { row: number; message: string }[];
  }> {
    const rows = this.parseCsv(
      buffer.toString('utf-8'),
    );

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

    const errors: { row: number; message: string }[] = [];
    let successCount = 0;
    let totalRows = 0;

    for (let i = 0; i < dataRows.length; i++) {
      const values = dataRows[i];

      // Skip fully blank rows
      if (values.every((value) => value.trim() === '')) {
        continue;
      }

      totalRows++;

      // Header row is row 1, so data rows start at row 2
      const rowNumber = i + 2;

      const record: Record<string, string> = {};
      columns.forEach((column, index) => {
        record[column] = (values[index] ?? '').trim();
      });

      try {
        const dto = this.mapCsvRowToDto(record);

        await this.create(dto, actor);

        successCount++;
      } catch (error) {
        const message =
          error instanceof Error
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

  // --------------------------------------------------
  // Map a CSV row (snake_case columns) to CreateKycDto
  // --------------------------------------------------
  private mapCsvRowToDto(
    row: Record<string, string>,
  ): CreateKycDto {
    const toOptionalInt = (value: string | undefined): number | undefined => {
      if (!value) {
        return undefined;
      }

      const parsed = Number(value);

      if (!Number.isFinite(parsed)) {
        throw new BadRequestException(`Invalid number: "${value}"`);
      }

      return parsed;
    };

    const missing: string[] = [];

    if (!row.full_name) missing.push('full_name');
    if (!row.gender) missing.push('gender');
    if (!row.dob_ad) missing.push('dob_ad');
    if (!row.citizenship_number) missing.push('citizenship_number');
    if (!row.phone_number) missing.push('phone_number');
    if (!row.permanent_province_id) missing.push('permanent_province_id');
    if (!row.permanent_district_id) missing.push('permanent_district_id');
    if (!row.permanent_municipality_id) missing.push('permanent_municipality_id');
    if (!row.permanent_ward_no) missing.push('permanent_ward_no');

    if (missing.length > 0) {
      throw new BadRequestException(
        `Missing required field(s): ${missing.join(', ')}`,
      );
    }

    if (!['Male', 'Female', 'Other'].includes(row.gender)) {
      throw new BadRequestException(
        `Invalid gender: "${row.gender}" (expected Male, Female or Other)`,
      );
    }

    const dto = new CreateKycDto();

    dto.fullName = row.full_name;
    dto.gender = row.gender as 'Male' | 'Female' | 'Other';
    dto.dobBs = row.dob_bs || undefined;
    dto.dobAd = row.dob_ad;
    dto.citizenshipNumber = row.citizenship_number;
    dto.citizenshipIssuedDistrict = row.citizenship_issued_district || undefined;
    dto.citizenshipIssuedDate = row.citizenship_issued_date || undefined;
    dto.phoneNumber = row.phone_number;
    dto.email = row.email || undefined;

    dto.permanentProvinceId = toOptionalInt(row.permanent_province_id)!;
    dto.permanentDistrictId = toOptionalInt(row.permanent_district_id)!;
    dto.permanentMunicipalityId = toOptionalInt(row.permanent_municipality_id)!;
    dto.permanentWardNo = toOptionalInt(row.permanent_ward_no)!;

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

  // --------------------------------------------------
  // Minimal CSV parser supporting quoted fields
  // --------------------------------------------------
  private parseCsv(text: string): string[][] {
    const content = text.replace(/\r\n/g, '\n').replace(/^\uFEFF/, '');

    const rows: string[][] = [];
    let row: string[] = [];
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
          } else {
            inQuotes = false;
          }
        } else {
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

    return rows.filter(
      (currentRow) => !(currentRow.length === 1 && currentRow[0] === ''),
    );
  }

  // --------------------------------------------------
  // Get all KYC records
  // --------------------------------------------------
  findAll(): Promise<Kyc[]> {
    return this.kycRepository.find({
      order: {
        createdDate: 'DESC',
      },
    });
  }

  // --------------------------------------------------
  // Get one KYC record
  // --------------------------------------------------
  async findOne(
    id: string,
  ): Promise<Kyc> {
    const record =
      await this.kycRepository.findOne({
        where: { id },
      });

    if (!record) {
      throw new NotFoundException(
        'KYC record not found',
      );
    }

    return record;
  }

  // --------------------------------------------------
  // Update KYC
  // --------------------------------------------------
  async update(
    id: string,
    dto: UpdateKycDto,
    actor: string,
  ): Promise<Kyc> {
    const record =
      await this.findOne(id);

    /*
     * Because UpdateKycDto is a PartialType,
     * dobBs or dobAd may not be included.
     *
     * So we use the existing value when
     * the field is not provided.
     */

    const dobBs =
      dto.dobBs !== undefined
        ? dto.dobBs
        : record.dobBs;

    const dobAd =
      dto.dobAd !== undefined
        ? dto.dobAd
        : record.dobAd;

    // Validate final BS + AD combination
    this.validateDob(
      dobBs ?? undefined,
      dobAd,
    );

    /*
     * Resolve the final permanent/temporary address values
     * (same "use existing value when not provided" pattern
     * as DOB above) and validate the province/district/
     * municipality chain before saving.
     */
    const finalPermanentProvinceId =
      dto.permanentProvinceId ?? record.permanentProvinceId;
    const finalPermanentDistrictId =
      dto.permanentDistrictId ?? record.permanentDistrictId;
    const finalPermanentMunicipalityId =
      dto.permanentMunicipalityId ?? record.permanentMunicipalityId;

    await this.validateAddressHierarchy(
      'Permanent',
      finalPermanentProvinceId,
      finalPermanentDistrictId,
      finalPermanentMunicipalityId,
    );

    const finalTemporaryProvinceId =
      dto.temporaryProvinceId === undefined
        ? record.temporaryProvinceId
        : dto.temporaryProvinceId;
    const finalTemporaryDistrictId =
      dto.temporaryDistrictId === undefined
        ? record.temporaryDistrictId
        : dto.temporaryDistrictId;
    const finalTemporaryMunicipalityId =
      dto.temporaryMunicipalityId === undefined
        ? record.temporaryMunicipalityId
        : dto.temporaryMunicipalityId;

    if (
      finalTemporaryProvinceId ||
      finalTemporaryDistrictId ||
      finalTemporaryMunicipalityId
    ) {
      if (
        !finalTemporaryProvinceId ||
        !finalTemporaryDistrictId ||
        !finalTemporaryMunicipalityId
      ) {
        throw new BadRequestException(
          'Temporary address requires province, district and municipality together',
        );
      }

      await this.validateAddressHierarchy(
        'Temporary',
        finalTemporaryProvinceId,
        finalTemporaryDistrictId,
        finalTemporaryMunicipalityId,
      );
    }

    Object.assign(record, {
      fullName:
        dto.fullName ??
        record.fullName,

      gender:
        dto.gender ??
        record.gender,

      dobBs:
        dto.dobBs === undefined
          ? record.dobBs
          : dto.dobBs,

      dobAd:
        dto.dobAd ??
        record.dobAd,

      citizenshipIssuedDistrict:
        dto.citizenshipIssuedDistrict ===
        undefined
          ? record.citizenshipIssuedDistrict
          : dto.citizenshipIssuedDistrict,

      citizenshipIssuedDate:
        dto.citizenshipIssuedDate ===
        undefined
          ? record.citizenshipIssuedDate
          : dto.citizenshipIssuedDate,

      phoneNumber:
        dto.phoneNumber ??
        record.phoneNumber,

      email:
        dto.email === undefined
          ? record.email
          : dto.email,

      // Permanent address
      permanentProvinceId:
        dto.permanentProvinceId ??
        record.permanentProvinceId,

      permanentDistrictId:
        dto.permanentDistrictId ??
        record.permanentDistrictId,

      permanentMunicipalityId:
        dto.permanentMunicipalityId ??
        record.permanentMunicipalityId,

      permanentWardNo:
        dto.permanentWardNo ??
        record.permanentWardNo,

      // Temporary address
      temporaryProvinceId:
        dto.temporaryProvinceId ===
        undefined
          ? record.temporaryProvinceId
          : dto.temporaryProvinceId,

      temporaryDistrictId:
        dto.temporaryDistrictId ===
        undefined
          ? record.temporaryDistrictId
          : dto.temporaryDistrictId,

      temporaryMunicipalityId:
        dto.temporaryMunicipalityId ===
        undefined
          ? record.temporaryMunicipalityId
          : dto.temporaryMunicipalityId,

      temporaryWardNo:
        dto.temporaryWardNo ===
        undefined
          ? record.temporaryWardNo
          : dto.temporaryWardNo,

      // Family
      fatherName:
        dto.fatherName === undefined
          ? record.fatherName
          : dto.fatherName,

      motherName:
        dto.motherName === undefined
          ? record.motherName
          : dto.motherName,

      grandfatherName:
        dto.grandfatherName === undefined
          ? record.grandfatherName
          : dto.grandfatherName,

      grandmotherName:
        dto.grandmotherName === undefined
          ? record.grandmotherName
          : dto.grandmotherName,

      // Other
      occupation:
        dto.occupation === undefined
          ? record.occupation
          : dto.occupation,

      panNumber:
        dto.panNumber === undefined
          ? record.panNumber
          : dto.panNumber,

      // Audit
      lastUpdatedBy: actor,
    });

    return this.kycRepository.save(
      record,
    );
  }

  // --------------------------------------------------
  // Upload KYC image
  // --------------------------------------------------
  async uploadImage(
    id: string,
    file: Express.Multer.File,
    actor: string,
  ): Promise<Kyc> {
    if (!file) {
      throw new BadRequestException(
        'Image is required',
      );
    }

    // Check whether KYC exists
    const record =
      await this.findOne(id);

    // Save relative URL in database
    record.imageUrl =
      `/uploads/kyc/${file.filename}`;

    // Track who uploaded/changed image
    record.lastUpdatedBy = actor;

    return this.kycRepository.save(
      record,
    );
  }

  // --------------------------------------------------
  // Delete KYC
  // --------------------------------------------------
  async remove(
    id: string,
  ): Promise<void> {
    const record =
      await this.findOne(id);

    await this.kycRepository.remove(
      record,
    );
  }
}