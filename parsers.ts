import * as htmlparser from "htmlparser2";
import { getWSIBClassificationFromNAICSCode } from "./wsibClassifications";
import type * as types from "./types";


interface ParseValidityPeriodReturn {
  start?: Date;
  end?: Date;
}


export const parseNAICS = (rawHTMLString: string): types.NAICSCode[] => {

  const naicsCodes = [];

  const rawNode = htmlparser.parseDocument(rawHTMLString.trim());

  for (const child of rawNode.childNodes) {

    if (child.type !== "tag") {
      continue;
    }

    const rawText = ((child as unknown as Element).children[0] as unknown as Text).data.trim();

    if (rawText.includes(":")) {

      const naicsCode: types.NAICSCode = {
        code: rawText.substring(0, rawText.indexOf(":")).trim(),
        codeDescription: rawText.substring(rawText.indexOf(":") + 1).trim()
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
  "Jan", "Feb", "Mar", "Apr",
  "May", "Jun", "Jul", "Aug",
  "Sep", "Oct", "Nov", "Dec"
];


const parseValidityPeriodDate = (rawDateString: string): Date => {

  const datePieces = rawDateString.split("-");

  return new Date(parseInt(datePieces[2], 10),
    validityPeriodMonthStrings.indexOf(datePieces[1]),
    parseInt(datePieces[0], 10));
};


export const parseValidityPeriod = (rawHTMLString: string): ParseValidityPeriodReturn => {

  const validityPeriod: ParseValidityPeriodReturn = {};

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
      } else {
        validityPeriod.start = periodDate;
      }
    }
  }

  return validityPeriod;
};
