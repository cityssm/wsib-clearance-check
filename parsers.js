import * as htmlparser from "htmlparser2";
import { getWSIBClassificationFromNAICSCode } from "./wsib-classifications.js";
export const stripHTML = (rawHTMLString) => {
    const cleanString = (rawHTMLString || "").trim();
    if (cleanString.charAt(0) === "<") {
        const rawNode = htmlparser.parseDocument(cleanString);
        return rawNode.firstChild.children[0].data;
    }
    return cleanString;
};
export const parseNAICS = (rawHTMLString) => {
    const naicsCodes = [];
    const rawNode = htmlparser.parseDocument(rawHTMLString.trim());
    for (const child of rawNode.childNodes) {
        if (child.type !== "tag") {
            continue;
        }
        const rawText = child.children[0].data.trim();
        if (rawText.includes(":")) {
            const naicsCode = {
                code: rawText.slice(0, Math.max(0, rawText.indexOf(":"))).trim(),
                codeDescription: rawText.slice(Math.max(0, rawText.indexOf(":") + 1)).trim()
            };
            const classification = getWSIBClassificationFromNAICSCode(naicsCode.code);
            if (classification) {
                Object.assign(naicsCode, classification);
            }
            naicsCodes.push(naicsCode);
        }
    }
    return naicsCodes;
};
const validityPeriodDateRegexp = /^\d+-[A-Z][a-z]{2}-\d{4}$/;
const validityPeriodMonthStrings = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
];
const parseValidityPeriodDate = (rawDateString) => {
    const datePieces = rawDateString.split("-");
    return new Date(Number.parseInt(datePieces[2], 10), validityPeriodMonthStrings.indexOf(datePieces[1]), Number.parseInt(datePieces[0], 10));
};
export const parseValidityPeriod = (rawHTMLString) => {
    const validityPeriod = {};
    const validityPeriodSplit = rawHTMLString.split(" ");
    for (const validityPeriodPiece of validityPeriodSplit) {
        const validityPeriodPieceTrim = validityPeriodPiece.trim();
        if (validityPeriodPieceTrim === "") {
            continue;
        }
        if (validityPeriodDateRegexp.test(validityPeriodPieceTrim)) {
            const periodDate = parseValidityPeriodDate(validityPeriodPieceTrim);
            if (validityPeriod.start) {
                validityPeriod.end = periodDate;
                break;
            }
            else {
                validityPeriod.start = periodDate;
            }
        }
    }
    return validityPeriod;
};
