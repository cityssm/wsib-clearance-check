import type * as types from "./types";
export declare const cleanRawCertificateOutput: (rawOutput: {}) => types.WSIBClearance_Certificate;
export declare const getClearanceByAccountNumber: (accountNumber: string) => Promise<types.WSIBClearance_Failure | types.WSIBClearance_Success>;
