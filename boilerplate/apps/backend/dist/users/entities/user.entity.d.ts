export declare class User {
    id: string;
    username: string;
    passwordHash: string;
    salt: string;
    firstName: string;
    middleName: string | null;
    lastName: string;
    dateOfBirth: string | null;
    createdBy: string | null;
    createdDate: Date;
    lastUpdatedBy: string | null;
    lastUpdatedDate: Date;
}
