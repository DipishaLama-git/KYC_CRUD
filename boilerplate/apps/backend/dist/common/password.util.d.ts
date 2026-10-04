export declare function hashPassword(plainPassword: string): Promise<{
    hash: string;
    salt: string;
}>;
export declare function verifyPassword(plainPassword: string, salt: string, expectedHash: string): Promise<boolean>;
