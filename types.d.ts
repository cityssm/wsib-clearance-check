export type WSIBClearanceCertificateFailure = WSIBClearanceAccountNumber & {
    success: false;
    errorURL?: string;
    error?: unknown;
};
export type WSIBClearanceCertificateSuccess = WSIBClearanceAccountNumber & WSIBClearanceCertificate & {
    success: true;
    certificateURL: string;
};
interface WSIBClearanceAccountNumber {
    accountNumber: string;
}
export interface WSIBClearanceCertificate {
    clearanceCertificateNumber: string;
    contractorLegalTradeName: string;
    contractorAddress: string;
    contractorNAICSCodes: NAICSCode[];
    validityPeriodEnd: Date;
    validityPeriodStart: Date;
    principalAddress: string;
    principalLegalTradeName: string;
}
export interface NAICSCode {
    code: string;
    codeDescription: string;
    classKey?: string;
    className?: string;
    subclassName?: string;
}
export interface WSIBClass {
    className: string;
    naicsPrefixes?: string[];
    subclasses?: Record<string, WSIBSubclass>;
}
export interface WSIBSubclass {
    subclassName: string;
    naicsPrefixes: string[];
}
export interface WSIBClassification {
    classKey: string;
    className: string;
    subclassName?: string;
}
export {};
