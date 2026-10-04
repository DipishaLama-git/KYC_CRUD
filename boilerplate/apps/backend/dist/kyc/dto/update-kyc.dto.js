"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateKycDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_kyc_dto_1 = require("./create-kyc.dto");
class UpdateKycDto extends (0, swagger_1.PartialType)((0, swagger_1.OmitType)(create_kyc_dto_1.CreateKycDto, ['citizenshipNumber'])) {
}
exports.UpdateKycDto = UpdateKycDto;
//# sourceMappingURL=update-kyc.dto.js.map