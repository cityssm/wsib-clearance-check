const wsibClasses_A = {
    className: "AGRICULTURE",
    naicsPrefixes: ["11", "001010"]
};
const wsibClasses_B = {
    className: "MINING, QUARRYING AND OIL AND GAS EXTRACTION",
    naicsPrefixes: ["21", "001020"]
};
const wsibClasses_C = {
    className: "UTILITIES",
    naicsPrefixes: ["22", "001030"]
};
const wsibClasses_D = {
    className: "GOVERNMENTAL AND RELATED SERVICES",
    subclasses: {
        1: {
            subclassName: "Educational services",
            naicsPrefixes: ["61", "001040"]
        },
        2: {
            subclassName: "Public administration",
            naicsPrefixes: ["91", "001050"]
        },
        3: {
            subclassName: "Hospitals",
            naicsPrefixes: ["622", "001060"]
        }
    }
};
const wsibClasses_E = {
    className: "MANUFACTURING",
    subclasses: {
        1: {
            subclassName: "Food, textiles and related manufacturing",
            naicsPrefixes: ["31", "001070"]
        },
        2: {
            subclassName: "Non-metallic and mineral manufacturing",
            naicsPrefixes: ["321", "322", "326", "327", "001080"]
        },
        3: {
            subclassName: "Printing, petroleum and chemical manufacturing",
            naicsPrefixes: ["323", "324", "325", "001090"]
        },
        4: {
            subclassName: "Metal transportation equipment and furniture manufacturing",
            naicsPrefixes: ["331", "332", "336", "337", "001100"]
        },
        5: {
            subclassName: "Machinery, electrical equipment and miscellaneous manufacturing",
            naicsPrefixes: ["333", "335", "339", "001110"]
        },
        6: {
            subclassName: "Computer and electronic manufacturing",
            naicsPrefixes: ["334", "001120"]
        }
    }
};
const wsibClasses_F = {
    className: "TRANSPORTATION AND WAREHOUSING",
    subclasses: {
        1: {
            subclassName: "Rail, water, truck transportation and postal service",
            naicsPrefixes: ["482", "483", "484", "491", "001130"]
        },
        2: {
            subclassName: "Air, transit, ground passenger, recreational and pipeline transportation, courier services and warehousing",
            naicsPrefixes: ["481", "485", "486", "487", "488", "492", "493", "001140"]
        }
    }
};
const wsibClasses_G = {
    className: "CONSTRUCTION",
    subclasses: {
        1: {
            subclassName: "Building construction",
            naicsPrefixes: ["2361", "2362", "001150", "007010"]
        },
        2: {
            subclassName: "Infrastructure construction",
            naicsPrefixes: ["237", "001160", "007020"]
        },
        3: {
            subclassName: "Foundation, structure and building exterior construction",
            naicsPrefixes: ["2381", "001170", "007030"]
        },
        4: {
            subclassName: "Building equipment construction",
            naicsPrefixes: ["2382", "001180", "007040"]
        },
        5: {
            subclassName: "Specialty trades construction",
            naicsPrefixes: ["2383", "2389", "001190", "007050"]
        }
    }
};
const wsibClasses_H = {
    className: "WHOLESALE",
    subclasses: {
        1: {
            subclassName: "Petroleum, food, motor vehicle and miscellaneous wholesale",
            naicsPrefixes: ["411, 412", "413", "415", "418", "001200"]
        },
        2: {
            subclassName: "Personal and household goods, building materials and machinery wholesale",
            naicsPrefixes: ["414", "416", "417", "419", "001210"]
        }
    }
};
const wsibClasses_I = {
    className: "RETAIL",
    subclasses: {
        1: {
            subclassName: "Motor vehicles, building materials and food and beverage retail",
            naicsPrefixes: ["441", "444", "445", "447", "001220"]
        },
        2: {
            subclassName: "Furniture, home furnishings, clothing and clothing accessories retail",
            naicsPrefixes: ["442", "448", "001230"]
        },
        3: {
            subclassName: "Electronics, appliances, health and personal care retail",
            naicsPrefixes: ["443", "446", "001240"]
        },
        4: {
            subclassName: "Specialized retail and department stores",
            naicsPrefixes: ["45", "001250"]
        }
    }
};
const wsibClasses_J = {
    className: "INFORMATION AND CULTURE",
    naicsPrefixes: ["51", "001260"]
};
const wsibClasses_K = {
    className: "FINANCE, MANAGEMENT AND LEASING",
    naicsPrefixes: ["52", "53", "55", "001270"]
};
const wsibClasses_L = {
    className: "PROFESSIONAL, SCIENTIFIC AND TECHNICAL",
    naicsPrefixes: ["54", "001280"]
};
const wsibClasses_M = {
    className: "ADMINISTRATION, SERVICES TO BUILDINGS, DWELLINGS AND OPEN SPACES",
    naicsPrefixes: ["56", "001290"]
};
const wsibClasses_N = {
    className: "NON-HOSPITAL HEALTH CARE AND SOCIAL ASSISTANCE",
    subclasses: {
        1: {
            subclassName: "Ambulatory health care",
            naicsPrefixes: ["621", "001300"]
        },
        2: {
            subclassName: "Nursing and residential care facilities",
            naicsPrefixes: ["623", "001310"]
        },
        3: {
            subclassName: "Social assistance",
            naicsPrefixes: ["624", "001320"]
        }
    }
};
const wsibClasses_O = {
    className: "LEISURE AND HOSPITALITY",
    naicsPrefixes: ["71", "72", "001330"]
};
const wsibClasses_P = {
    className: "OTHER SERVICES",
    naicsPrefixes: ["81", "001340"]
};
const wsibClasses = {
    A: wsibClasses_A,
    B: wsibClasses_B,
    C: wsibClasses_C,
    D: wsibClasses_D,
    E: wsibClasses_E,
    F: wsibClasses_F,
    G: wsibClasses_G,
    H: wsibClasses_H,
    I: wsibClasses_I,
    J: wsibClasses_J,
    K: wsibClasses_K,
    L: wsibClasses_L,
    M: wsibClasses_M,
    N: wsibClasses_N,
    O: wsibClasses_O,
    P: wsibClasses_P
};
Object.freeze(wsibClasses);
const hasNAICSCodeMatch = (naicsCode, naicsPrefixes) => {
    for (const naicsPrefix of naicsPrefixes) {
        if (naicsCode.startsWith(naicsPrefix)) {
            return true;
        }
    }
    return false;
};
const naicsCodeClassificationCache = new Map();
export const getWSIBClassificationFromNAICSCode = (naicsCode) => {
    if (naicsCodeClassificationCache.has(naicsCode)) {
        return naicsCodeClassificationCache.get(naicsCode);
    }
    const classKeyParts = Object.keys(wsibClasses);
    for (const classKeyPart of classKeyParts) {
        const wsibClass = wsibClasses[classKeyPart];
        if (wsibClass.naicsPrefixes && hasNAICSCodeMatch(naicsCode, wsibClass.naicsPrefixes)) {
            const classification = {
                classKey: classKeyPart,
                className: wsibClass.className
            };
            naicsCodeClassificationCache.set(naicsCode, classification);
            return classification;
        }
        if (wsibClass.subclasses) {
            const subclassKeyParts = Object.keys(wsibClass.subclasses);
            for (const subclassKeyPart of subclassKeyParts) {
                const wsibSubclass = wsibClass.subclasses[subclassKeyPart];
                if (hasNAICSCodeMatch(naicsCode, wsibSubclass.naicsPrefixes)) {
                    const classification = {
                        classKey: classKeyPart + subclassKeyPart,
                        className: wsibClass.className,
                        subclassName: wsibSubclass.subclassName
                    };
                    naicsCodeClassificationCache.set(naicsCode, classification);
                    return classification;
                }
            }
        }
    }
    return undefined;
};
