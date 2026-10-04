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
exports.MunicipalitiesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const create_municipality_dto_1 = require("./dto/create-municipality.dto");
const update_municipality_dto_1 = require("./dto/update-municipality.dto");
const municipalities_service_1 = require("./municipalities.service");
let MunicipalitiesController = class MunicipalitiesController {
    municipalitiesService;
    constructor(municipalitiesService) {
        this.municipalitiesService = municipalitiesService;
    }
    create(dto) {
        return this.municipalitiesService.create(dto);
    }
    findAll() {
        return this.municipalitiesService.findAll();
    }
    findOne(id) {
        return this.municipalitiesService.findOne(id);
    }
    update(id, dto) {
        return this.municipalitiesService.update(id, dto);
    }
    remove(id) {
        return this.municipalitiesService.remove(id);
    }
};
exports.MunicipalitiesController = MunicipalitiesController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_municipality_dto_1.CreateMunicipalityDto]),
    __metadata("design:returntype", void 0)
], MunicipalitiesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MunicipalitiesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], MunicipalitiesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_municipality_dto_1.UpdateMunicipalityDto]),
    __metadata("design:returntype", void 0)
], MunicipalitiesController.prototype, "update", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], MunicipalitiesController.prototype, "remove", null);
exports.MunicipalitiesController = MunicipalitiesController = __decorate([
    (0, swagger_1.ApiTags)('municipalities'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('municipalities'),
    __metadata("design:paramtypes", [municipalities_service_1.MunicipalitiesService])
], MunicipalitiesController);
//# sourceMappingURL=municipalities.controller.js.map