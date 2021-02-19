"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseValidityPeriod = exports.parseNAICS = void 0;
const htmlparser = require("htmlparser2");
const wsibClassifications_1 = require("./wsibClassifications");
const parseNAICS = (rawHTMLString) => {
    const naicsCodes = [];
    const rawNode = htmlparser.parseDocument(rawHTMLString.trim());
    for (const child of rawNode.childNodes) {
        if (child.type !== "tag") {
            continue;
        }
        const rawText = child.children[0].data.trim();
        if (rawText.includes(":")) {
            const naicsCode = {
                code: rawText.substring(0, rawText.indexOf(":")).trim(),
                codeDescription: rawText.substring(rawText.indexOf(":") + 1).trim()
            };
            const classification = wsibClassifications_1.getWSIBClassificationFromNAICSCode(naicsCode.code);
            if (classification) {
                Object.assign(naicsCode, classification);
            }
            naicsCodes.push(naicsCode);
        }
    }
    return naicsCodes;
};
exports.parseNAICS = parseNAICS;
const validityPeriodDateRegexp = /^\d+-[A-Z][a-z]{2}-\d{4}$/;
const validityPeriodMonthStrings = [
    "Jan", "Feb", "Mar", "Apr",
    "May", "Jun", "Jul", "Aug",
    "Sep", "Oct", "Nov", "Dec"
];
const parseValidityPeriodDate = (rawDateString) => {
    const datePieces = rawDateString.split("-");
    return new Date(parseInt(datePieces[2], 10), validityPeriodMonthStrings.indexOf(datePieces[1]), parseInt(datePieces[0], 10));
};
const parseValidityPeriod = (rawHTMLString) => {
    const validityPeriod = {};
    const validityPeriodSplit = rawHTMLString.split(" ");
    for (const validityPeriodPiece of validityPeriodSplit) {
        const validityPeriodPieceTrim = validityPeriodPiece.trim();
        if (validityPeriodPieceTrim === "") {
            continue;
        }
        if (validityPeriodDateRegexp.test(validityPeriodPieceTrim)) {
            const periodDate = parseValidityPeriodDate(validityPeriodPieceTrim);
            if (validityPeriod.hasOwnProperty("start")) {
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
exports.parseValidityPeriod = parseValidityPeriod;
