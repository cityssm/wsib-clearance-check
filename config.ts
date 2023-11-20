// Search Form

export const clearanceStart_url =
  'https://clearances.wsib.ca/Clearances/eclearance/start'

export const clearanceStart_searchFormSelector = '#TOKENSimpleSearchForm'
export const clearanceStart_searchFieldSelector = '#simpleAccountNumbersTOKEN'

// Search Results

export const clearanceResult_certificateLinkSelector =
  "#eClearanceWorkspaceTargSubDivFormXX .fancytable a[rel='eClearanceWorkspaceContent'][href^='GCSearchCertDet']"
export const clearanceResult_certificateBadStandingSelector =
  '#eClearanceWorkspaceTargSubDivFormXX .fancytable .badstanding'
export const clearanceResult_defaultErrorMessage =
  'Clearance certificate link not found.'

// Certificate

export const certificate_tableSelector =
  '#eClearanceWorkspaceDivForm .fancytable'

export const certificateField_contractorLegalTradeName =
  'Contractor Legal / Trade Name'
export const certificateField_contractorAddress = 'Contractor Address'
export const certificateField_naicsCodes =
  'Contractor NAICS Code and Code Description'
export const certificateField_clearanceCertificateNumber =
  'Clearance certificate number'
export const certificateField_validityPeriod = 'Validity period (dd-mmm-yyyy)'
export const certificateField_principalLegalTradeName =
  'Principal Legal / Trade Name'
export const certificateField_principalAddress = 'Principal Address'
