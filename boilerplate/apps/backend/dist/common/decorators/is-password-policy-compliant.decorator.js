"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsPasswordPolicyCompliant = IsPasswordPolicyCompliant;
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
function IsPasswordPolicyCompliant() {
    return (0, common_1.applyDecorators)((0, class_validator_1.MaxLength)(128), (0, class_validator_1.IsStrongPassword)({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
    }, {
        message: 'Password must be at least 8 characters and include an uppercase letter, a lowercase letter, a number and a symbol',
    }));
}
//# sourceMappingURL=is-password-policy-compliant.decorator.js.map