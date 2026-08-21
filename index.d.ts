import type { WSIBClearanceCertificateFailure, WSIBClearanceCertificateSuccess } from './types.js';
/**
 * Retrieves a WSIB clearance certificate from the WSIB website.
 * @param accountNumber - The WSIB account number
 * @returns The WSIB clearance certificate data.
 * @throws {Error} When the WSIB website is not available or returns an error response.
 */
export declare function getClearanceByAccountNumber(accountNumber: string): Promise<WSIBClearanceCertificateFailure | WSIBClearanceCertificateSuccess>;
/**
 * Closes the cached web browser.
 */
export declare function cleanUpBrowser(): Promise<void>;
export default getClearanceByAccountNumber;
