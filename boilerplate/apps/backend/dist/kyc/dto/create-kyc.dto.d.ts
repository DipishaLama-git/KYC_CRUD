export declare class CreateKycDto {
    fullName: string;
    gender: 'Male' | 'Female' | 'Other';
    dobBs?: string;
    dobAd: string;
    citizenshipNumber: string;
    citizenshipIssuedDistrict?: string;
    citizenshipIssuedDate?: string;
    phoneNumber: string;
    email?: string;
    permanentProvinceId: number;
    permanentDistrictId: number;
    permanentMunicipalityId: number;
    permanentWardNo: number;
    temporaryProvinceId?: number;
    temporaryDistrictId?: number;
    temporaryMunicipalityId?: number;
    temporaryWardNo?: number;
    fatherName?: string;
    motherName?: string;
    grandfatherName?: string;
    grandmotherName?: string;
    occupation?: string;
    panNumber?: string;
}
