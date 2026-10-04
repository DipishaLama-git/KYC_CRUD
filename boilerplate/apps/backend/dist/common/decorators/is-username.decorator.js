"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsUsername = IsUsername;
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
const USERNAME_REGEX = /^[a-zA-Z0-9]+$/;
function IsUsername() {
    return (0, common_1.applyDecorators)((0, class_validator_1.IsString)(), (0, class_validator_1.Length)(3, 50, { message: 'Username must be between 3 and 50 characters' }), (0, class_validator_1.Matches)(USERNAME_REGEX, { message: 'Username must contain letters and numbers only (no spaces or symbols)' }));
}
//# sourceMappingURL=is-username.decorator.js.map