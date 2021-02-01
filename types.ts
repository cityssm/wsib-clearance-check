export interface WSIBClearance_Failure {
  success: boolean;
  accountNumber: string;
  error?: Error;
}

export type WSIBClearance_Success = WSIBClearance_Failure & WSIBClearance_Certificate;


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
