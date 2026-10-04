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
exports.DistrictsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const districts_entity_1 = require("./entities/districts.entity");
let DistrictsService = class DistrictsService {
    districtsRepository;
    constructor(districtsRepository) {
        this.districtsRepository = districtsRepository;
    }
    async create(dto) {
        const existing = await this.districtsRepository.findOne({
            where: { name: dto.name, provinceId: dto.provinceId },
        });
        if (existing) {
            throw new common_1.ConflictException('A district with this name already exists in this province');
        }
        const raw = await this.districtsRepository
            .createQueryBuilder('district')
            .select('MAX(district.id)', 'max')
            .getRawOne();
        const district = this.districtsRepository.create({
            id: (raw?.max ?? 0) + 1,
            name: dto.name,
            provinceId: dto.provinceId,
        });
        return this.districtsRepository.save(district);
    }
    findAll() {
        return this.districtsRepository.find({ order: { id: 'ASC' } });
    }
    async findOne(id) {
        const district = await this.districtsRepository.findOne({ where: { id } });
        if (!district) {
            throw new common_1.NotFoundException('District not found');
        }
        return district;
    }
    async update(id, dto) {
        const district = await this.findOne(id);
        const nextName = dto.name ?? district.name;
        const nextProvinceId = dto.provinceId ?? district.provinceId;
        if (nextName !== district.name || nextProvinceId !== district.provinceId) {
            const existing = await this.districtsRepository.findOne({
                where: { name: nextName, provinceId: nextProvinceId },
            });
            if (existing && existing.id !== id) {
                throw new common_1.ConflictException('A district with this name already exists in this province');
            }
        }
        district.name = nextName;
        district.provinceId = nextProvinceId;
        return this.districtsRepository.save(district);
    }
    async remove(id) {
        const district = await this.findOne(id);
        await this.districtsRepository.remove(district);
    }
};
exports.DistrictsService = DistrictsService;
exports.DistrictsService = DistrictsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(districts_entity_1.District)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], DistrictsService);
//# sourceMappingURL=districts.service.js.map