/*
 * https://www.wsib.ca/en/operational-policy-manual/classification-structure
 */

import type { WSIBClass, WSIBClassification } from './types.js'

const wsibClassesA: WSIBClass = {
  className: 'AGRICULTURE',
  naicsPrefixes: ['11', '001010']
}

const wsibClassesB: WSIBClass = {
  className: 'MINING, QUARRYING AND OIL AND GAS EXTRACTION',
  naicsPrefixes: ['21', '001020']
}

const wsibClassesC: WSIBClass = {
  className: 'UTILITIES',
  naicsPrefixes: ['22', '001030']
}

const wsibClassesD: WSIBClass = {
  className: 'GOVERNMENTAL AND RELATED SERVICES',
  subclasses: {
    1: {
      subclassName: 'Educational services',
      naicsPrefixes: ['61', '001040']
    },
    2: {
      subclassName: 'Public administration',
      naicsPrefixes: ['91', '001050']
    },
    3: {
      subclassName: 'Hospitals',
      naicsPrefixes: ['622', '001060']
    }
  }
}

const wsibClassesE: WSIBClass = {
  className: 'MANUFACTURING',
  subclasses: {
    1: {
      subclassName: 'Food, textiles and related manufacturing',
      naicsPrefixes: ['31', '001070']
    },
    2: {
      subclassName: 'Non-metallic and mineral manufacturing',
      naicsPrefixes: ['321', '322', '326', '327', '001080']
    },
    3: {
      subclassName: 'Printing, petroleum and chemical manufacturing',
      naicsPrefixes: ['323', '324', '325', '001090']
    },
    4: {
      subclassName:
        'Metal transportation equipment and furniture manufacturing',
      naicsPrefixes: ['331', '332', '336', '337', '001100']
    },
    5: {
      subclassName:
        'Machinery, electrical equipment and miscellaneous manufacturing',
      naicsPrefixes: ['333', '335', '339', '001110']
    },
    6: {
      subclassName: 'Computer and electronic manufacturing',
      naicsPrefixes: ['334', '001120']
    }
  }
}

const wsibClassesF: WSIBClass = {
  className: 'TRANSPORTATION AND WAREHOUSING',
  subclasses: {
    1: {
      subclassName: 'Rail, water, truck transportation and postal service',
      naicsPrefixes: ['482', '483', '484', '491', '001130']
    },
    2: {
      subclassName:
        'Air, transit, ground passenger, recreational and pipeline transportation, courier services and warehousing',
      naicsPrefixes: ['481', '485', '486', '487', '488', '492', '493', '001140']
    }
  }
}

const wsibClassesG: WSIBClass = {
  className: 'CONSTRUCTION',
  subclasses: {
    1: {
      subclassName: 'Building construction',
      naicsPrefixes: ['2361', '2362', '001150', '007010']
    },
    2: {
      subclassName: 'Infrastructure construction',
      naicsPrefixes: ['237', '001160', '007020']
    },
    3: {
      subclassName: 'Foundation, structure and building exterior construction',
      naicsPrefixes: ['2381', '001170', '007030']
    },
    4: {
      subclassName: 'Building equipment construction',
      naicsPrefixes: ['2382', '001180', '007040']
    },
    5: {
      subclassName: 'Specialty trades construction',
      naicsPrefixes: ['2383', '2389', '001190', '007050']
    }
  }
}

const wsibClassesH: WSIBClass = {
  className: 'WHOLESALE',
  subclasses: {
    1: {
      subclassName:
        'Petroleum, food, motor vehicle and miscellaneous wholesale',
      naicsPrefixes: ['411, 412', '413', '415', '418', '001200']
    },
    2: {
      subclassName:
        'Personal and household goods, building materials and machinery wholesale',
      naicsPrefixes: ['414', '416', '417', '419', '001210']
    }
  }
}

const wsibClassesI: WSIBClass = {
  className: 'RETAIL',
  subclasses: {
    1: {
      subclassName:
        'Motor vehicles, building materials and food and beverage retail',
      naicsPrefixes: ['441', '444', '445', '447', '001220']
    },
    2: {
      subclassName:
        'Furniture, home furnishings, clothing and clothing accessories retail',
      naicsPrefixes: ['442', '448', '001230']
    },
    3: {
      subclassName: 'Electronics, appliances, health and personal care retail',
      naicsPrefixes: ['443', '446', '001240']
    },
    4: {
      subclassName: 'Specialized retail and department stores',
      naicsPrefixes: ['45', '001250']
    }
  }
}

const wsibClassesJ: WSIBClass = {
  className: 'INFORMATION AND CULTURE',
  naicsPrefixes: ['51', '001260']
}

const wsibClassesK: WSIBClass = {
  className: 'FINANCE, MANAGEMENT AND LEASING',
  naicsPrefixes: ['52', '53', '55', '001270']
}

const wsibClassesL: WSIBClass = {
  className: 'PROFESSIONAL, SCIENTIFIC AND TECHNICAL',
  naicsPrefixes: ['54', '001280']
}

const wsibClassesM: WSIBClass = {
  className: 'ADMINISTRATION, SERVICES TO BUILDINGS, DWELLINGS AND OPEN SPACES',
  naicsPrefixes: ['56', '001290']
}

const wsibClassesN: WSIBClass = {
  className: 'NON-HOSPITAL HEALTH CARE AND SOCIAL ASSISTANCE',
  subclasses: {
    1: {
      subclassName: 'Ambulatory health care',
      naicsPrefixes: ['621', '001300']
    },
    2: {
      subclassName: 'Nursing and residential care facilities',
      naicsPrefixes: ['623', '001310']
    },
    3: {
      subclassName: 'Social assistance',
      naicsPrefixes: ['624', '001320']
    }
  }
}

const wsibClassesO: WSIBClass = {
  className: 'LEISURE AND HOSPITALITY',
  naicsPrefixes: ['71', '72', '001330']
}

const wsibClassesP: WSIBClass = {
  className: 'OTHER SERVICES',
  naicsPrefixes: ['81', '001340']
}

const wsibClasses: Record<string, WSIBClass> = {
  A: wsibClassesA,
  B: wsibClassesB,
  C: wsibClassesC,
  D: wsibClassesD,
  E: wsibClassesE,
  F: wsibClassesF,
  G: wsibClassesG,
  H: wsibClassesH,
  I: wsibClassesI,
  J: wsibClassesJ,
  K: wsibClassesK,
  L: wsibClassesL,
  M: wsibClassesM,
  N: wsibClassesN,
  O: wsibClassesO,
  P: wsibClassesP
}

Object.freeze(wsibClasses)

/*
 * Classification Helper
 */

function hasNAICSCodeMatch(
  naicsCode: string,
  naicsPrefixes: string[]
): boolean {
  for (const naicsPrefix of naicsPrefixes) {
    if (naicsCode.startsWith(naicsPrefix)) {
      return true
    }
  }

  return false
}

const naicsCodeClassificationCache = new Map<string, WSIBClassification>()

export function getWSIBClassificationFromNAICSCode(
  naicsCode: string
): WSIBClassification | undefined {
  if (naicsCodeClassificationCache.has(naicsCode)) {
    return naicsCodeClassificationCache.get(naicsCode)
  }

  const classKeyParts = Object.keys(wsibClasses)

  for (const classKeyPart of classKeyParts) {
    const wsibClass = wsibClasses[classKeyPart]

    if (
      wsibClass.naicsPrefixes &&
      hasNAICSCodeMatch(naicsCode, wsibClass.naicsPrefixes)
    ) {
      const classification = {
        classKey: classKeyPart,
        className: wsibClass.className
      }

      naicsCodeClassificationCache.set(naicsCode, classification)

      return classification
    }

    if (wsibClass.subclasses) {
      const subclassKeyParts = Object.keys(wsibClass.subclasses)

      for (const subclassKeyPart of subclassKeyParts) {
        const wsibSubclass = wsibClass.subclasses[subclassKeyPart]

        if (hasNAICSCodeMatch(naicsCode, wsibSubclass.naicsPrefixes)) {
          const classification = {
            classKey: classKeyPart + subclassKeyPart,
            className: wsibClass.className,
            subclassName: wsibSubclass.subclassName
          }

          naicsCodeClassificationCache.set(naicsCode, classification)

          return classification
        }
      }
    }
  }

  return undefined
}
