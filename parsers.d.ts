import type { NAICSCode } from './types.js';
interface ParseValidityPeriodReturn {
    start?: Date;
    end?: Date;
}
export declare function stripHTML(rawHTMLString: string): string;
export declare function parseNAICS(rawHTMLString: string): NAICSCode[];
export declare function parseValidityPeriod(rawHTMLString: string): ParseValidityPeriodReturn;
export {};
