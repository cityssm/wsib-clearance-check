import type { WSIBClearance_Failure, WSIBClearance_Success } from './types.js';
/**
 * Retrieves a WSIB clearance certificate from the WSIB website.
 * @param accountNumber - The WSIB account number
 * @returns The WSIB clearance certificate data.
 */
export declare function getClearanceByAccountNumber(accountNumber: string): Promise<WSIBClearance_Failure | WSIBClearance_Success>;
/**
 * Closes the cached web browser.
 */
export declare function cleanUpBrowser(): Promise<void>;
export default getClearanceByAccountNumber;
