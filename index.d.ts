import type * as types from './types.js';
export declare function setHeadless(headlessStatus: boolean): void;
export declare function getClearanceByAccountNumber(accountNumber: string): Promise<types.WSIBClearance_Failure | types.WSIBClearance_Success>;
export declare function cleanUpBrowser(): Promise<void>;
export default getClearanceByAccountNumber;
