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
exports.Kyc = void 0;
const typeorm_1 = require("typeorm");
let Kyc = class Kyc {
    id;
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
    imageUrl;
    createdBy;
    createdDate;
    lastUpdatedBy;
    lastUpdatedDate;
};
exports.Kyc = Kyc;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Kyc.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'full_name', type: 'varchar', length: 200 }),
    __metadata("design:type", String)
], Kyc.prototype, "fullName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 10 }),
    __metadata("design:type", String)
], Kyc.prototype, "gender", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'dob_bs', type: 'varchar', length: 10, nullable: true }),
    __metadata("design:type", Object)
], Kyc.prototype, "dobBs", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'dob_ad', type: 'date' }),
    __metadata("design:type", String)
], Kyc.prototype, "dobAd", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'citizenship_number', type: 'varchar', length: 50, unique: true }),
    __metadata("design:type", String)
], Kyc.prototype, "citizenshipNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'citizenship_issued_district', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], Kyc.prototype, "citizenshipIssuedDistrict", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'citizenship_issued_date', type: 'date', nullable: true }),
    __metadata("design:type", Object)
], Kyc.prototype, "citizenshipIssuedDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'phone_number', type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], Kyc.prototype, "phoneNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], Kyc.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'permanent_province_id', type: 'int' }),
    __metadata("design:type", Number)
], Kyc.prototype, "permanentProvinceId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'permanent_district_id', type: 'int' }),
    __metadata("design:type", Number)
], Kyc.prototype, "permanentDistrictId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'permanent_municipality_id', type: 'int' }),
    __metadata("design:type", Number)
], Kyc.prototype, "permanentMunicipalityId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'permanent_ward_no', type: 'smallint' }),
    __metadata("design:type", Number)
], Kyc.prototype, "permanentWardNo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'temporary_province_id', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], Kyc.prototype, "temporaryProvinceId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'temporary_district_id', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], Kyc.prototype, "temporaryDistrictId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'temporary_municipality_id', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], Kyc.prototype, "temporaryMunicipalityId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'temporary_ward_no', type: 'smallint', nullable: true }),
    __metadata("design:type", Object)
], Kyc.prototype, "temporaryWardNo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'father_name', type: 'varchar', length: 200, nullable: true }),
    __metadata("design:type", Object)
], Kyc.prototype, "fatherName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'mother_name', type: 'varchar', length: 200, nullable: true }),
    __metadata("design:type", Object)
], Kyc.prototype, "motherName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'grandfather_name', type: 'varchar', length: 200, nullable: true }),
    __metadata("design:type", Object)
], Kyc.prototype, "grandfatherName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'grandmother_name', type: 'varchar', length: 200, nullable: true }),
    __metadata("design:type", Object)
], Kyc.prototype, "grandmotherName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], Kyc.prototype, "occupation", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'pan_number', type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", Object)
], Kyc.prototype, "panNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'image_url', type: 'varchar', length: 500, nullable: true }),
    __metadata("design:type", Object)
], Kyc.prototype, "imageUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], Kyc.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_date' }),
    __metadata("design:type", Date)
], Kyc.prototype, "createdDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'last_updated_by', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], Kyc.prototype, "lastUpdatedBy", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'last_updated_date' }),
    __metadata("design:type", Date)
], Kyc.prototype, "lastUpdatedDate", void 0);
exports.Kyc = Kyc = __decorate([
    (0, typeorm_1.Entity)('kyc')
], Kyc);
//# sourceMappingURL=kyc.entity.js.map