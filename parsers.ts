import { parseDocument } from 'htmlparser2'

import type { NAICSCode } from './types.js'
import { getWSIBClassificationFromNAICSCode } from './wsibClassifications.js'

interface ParseValidityPeriodReturn {
  start?: Date
  end?: Date
}

export const stripHTML = (rawHTMLString: string): string => {
  const cleanString = (rawHTMLString ?? '').trim()

  if (cleanString.charAt(0) === '<') {
    const rawNode = parseDocument(cleanString)
    return (
      (rawNode.firstChild as unknown as Element).children[0] as unknown as Text
    ).data
  }

  return cleanString
}

export const parseNAICS = (rawHTMLString: string): NAICSCode[] => {
  const naicsCodes: NAICSCode[] = []

  const rawNode = parseDocument(rawHTMLString.trim())

  for (const child of rawNode.childNodes) {
    if (child.type !== 'tag') {
      continue
    }

    const rawText = (
      (child as unknown as Element).children[0] as unknown as Text
    ).data.trim()

    if (rawText.includes(':')) {
      const naicsCode: NAICSCode = {
        code: rawText.slice(0, Math.max(0, rawText.indexOf(':'))).trim(),
        codeDescription: rawText
          .slice(Math.max(0, rawText.indexOf(':') + 1))
          .trim()
      }

      const classification = getWSIBClassificationFromNAICSCode(naicsCode.code)

      if (classification) {
        Object.assign(naicsCode, classification)
      }

      naicsCodes.push(naicsCode)
    }
  }

  return naicsCodes
}

const validityPeriodDateRegexp = /^\d+-[A-Z][a-z]{2}-\d{4}$/

const validityPeriodMonthStrings = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
]

const parseValidityPeriodDate = (rawDateString: string): Date => {
  const datePieces = rawDateString.split('-')

  return new Date(
    Number.parseInt(datePieces[2], 10),
    validityPeriodMonthStrings.indexOf(datePieces[1]),
    Number.parseInt(datePieces[0], 10)
  )
}

export const parseValidityPeriod = (
  rawHTMLString: string
): ParseValidityPeriodReturn => {
  const validityPeriod: ParseValidityPeriodReturn = {}

  const validityPeriodSplit = rawHTMLString.split(' ')

  for (const validityPeriodPiece of validityPeriodSplit) {
    const validityPeriodPieceTrim = validityPeriodPiece.trim()

    if (validityPeriodPieceTrim === '') {
      continue
    }

    if (validityPeriodDateRegexp.test(validityPeriodPieceTrim)) {
      const periodDate = parseValidityPeriodDate(validityPeriodPieceTrim)

      if (validityPeriod.start) {
        validityPeriod.end = periodDate
        break
      } else {
        validityPeriod.start = periodDate
      }
    }
  }

  return validityPeriod
}
