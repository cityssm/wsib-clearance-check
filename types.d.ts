interface WSIBClearance_AccountNumber {
    accountNumber: string;
}
export declare type WSIBClearance_Failure = {
    success: false;
    error?: Error;
} & WSIBClearance_AccountNumber;
export declare type WSIBClearance_Success = {
    success: true;
} & WSIBClearance_AccountNumber & WSIBClearance_Certificate;
export interface WSIBClearance_Certificate {
    contractorLegalTradeName: string;
    contractorAddress: string;
    contractorNAICSCodes: NAICSCode[];
    clearanceCertificateNumber: string;
    validityPeriodStart: Date;
    validityPeriodEnd: Date;
    principalLegalTradeName: string;
    principalAddress: string;
}
export interface NAICSCode {
    code: string;
    codeDescription: string;
}
export {};
