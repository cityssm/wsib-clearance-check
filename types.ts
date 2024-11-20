export type WSIBClearance_Failure = {
  success: false
  errorURL?: string
  error?: Error
} & WSIBClearance_AccountNumber

export type WSIBClearance_Success = {
  success: true
  certificateURL: string
} & WSIBClearance_AccountNumber &
  WSIBClearance_Certificate

interface WSIBClearance_AccountNumber {
  accountNumber: string
}

export interface WSIBClearance_Certificate {
  contractorLegalTradeName: string
  contractorAddress: string
  contractorNAICSCodes: NAICSCode[]
  clearanceCertificateNumber: string
  validityPeriodStart: Date
  validityPeriodEnd: Date
  principalLegalTradeName: string
  principalAddress: string
}

/*
 * Classifications
 */

export interface NAICSCode {
  code: string
  codeDescription: string
  classKey?: string
  className?: string
  subclassName?: string
}

export interface WSIBClass {
  className: string
  naicsPrefixes?: string[]
  subclasses?: Record<string, WSIBSubclass>
}

export interface WSIBSubclass {
  subclassName: string
  naicsPrefixes: string[]
}

export interface WSIBClassification {
  classKey: string
  className: string
  subclassName?: string
}
