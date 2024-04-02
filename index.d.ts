import type { WSIBClearance_Failure, WSIBClearance_Success } from './types.js';
export declare function getClearanceByAccountNumber(accountNumber: string): Promise<WSIBClearance_Failure | WSIBClearance_Success>;
export declare function cleanUpBrowser(): Promise<void>;
export default getClearanceByAccountNumber;
