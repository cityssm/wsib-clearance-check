import type { NAICSCode } from './types.js';
interface ParseValidityPeriodReturn {
    start?: Date;
    end?: Date;
}
export declare const stripHTML: (rawHTMLString: string) => string;
export declare const parseNAICS: (rawHTMLString: string) => NAICSCode[];
export declare const parseValidityPeriod: (rawHTMLString: string) => ParseValidityPeriodReturn;
export {};
