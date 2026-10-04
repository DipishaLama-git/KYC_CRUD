"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = hashPassword;
exports.verifyPassword = verifyPassword;
const node_crypto_1 = require("node:crypto");
const node_util_1 = require("node:util");
const scryptAsync = (0, node_util_1.promisify)(node_crypto_1.scrypt);
const KEY_LENGTH = 64;
async function hashPassword(plainPassword) {
    const salt = (0, node_crypto_1.randomBytes)(16).toString('hex');
    const derivedKey = (await scryptAsync(plainPassword, salt, KEY_LENGTH));
    return { hash: derivedKey.toString('hex'), salt };
}
async function verifyPassword(plainPassword, salt, expectedHash) {
    const derivedKey = (await scryptAsync(plainPassword, salt, KEY_LENGTH));
    const expectedBuffer = Buffer.from(expectedHash, 'hex');
    if (derivedKey.length !== expectedBuffer.length) {
        return false;
    }
    return (0, node_crypto_1.timingSafeEqual)(derivedKey, expectedBuffer);
}
//# sourceMappingURL=password.util.js.map