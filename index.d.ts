import type * as types from "./types";
export declare const getClearanceByAccountNumber: (accountNumber: string) => Promise<types.WSIBClearance_Failure | types.WSIBClearance_Success>;
export default getClearanceByAccountNumber;
