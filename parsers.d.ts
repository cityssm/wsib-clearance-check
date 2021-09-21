import type * as types from "./types";
interface ParseValidityPeriodReturn {
    start?: Date;
    end?: Date;
}
export declare const stripHTML: (rawHTMLString: string) => string;
export declare const parseNAICS: (rawHTMLString: string) => types.NAICSCode[];
export declare const parseValidityPeriod: (rawHTMLString: string) => ParseValidityPeriodReturn;
export {};
