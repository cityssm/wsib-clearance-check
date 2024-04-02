# WSIB Clearance Check

[![npm (scoped)](https://img.shields.io/npm/v/@cityssm/wsib-clearance-check)](https://www.npmjs.com/package/@cityssm/wsib-clearance-check)
[![DeepSource](https://app.deepsource.com/gh/cityssm/wsib-clearance-check.svg/?label=active+issues&show_trend=true&token=8Wg_seH68YGf4tZKozKTme7b)](https://app.deepsource.com/gh/cityssm/wsib-clearance-check/)
[![Code Climate maintainability](https://img.shields.io/codeclimate/maintainability/cityssm/wsib-clearance-check)](https://codeclimate.com/github/cityssm/wsib-clearance-check)
[![codecov](https://codecov.io/gh/cityssm/wsib-clearance-check/graph/badge.svg?token=ADZDRCPX33)](https://codecov.io/gh/cityssm/wsib-clearance-check)
[![Coverage Testing](https://github.com/cityssm/wsib-clearance-check/actions/workflows/coverage.yml/badge.svg)](https://github.com/cityssm/wsib-clearance-check/actions/workflows/coverage.yml)

A tool to scrape the clearance certificate status from the
[WSIB Online Services Clearance Certificate Website](https://onlineservices.wsib.on.ca/EClearanceWeb/eclearance/start).

## Installation

```bash
npm install @cityssm/wsib-clearance-check
```

## Usage

```javascript
import * as wsib from "@cityssm/wsib-clearance-check";

const cert = await wsib.getClearanceByAccountNumber(123);
```

## Output
```javascript
{
  success: true,
  accountNumber: '123',
  contractorLegalTradeName: 'LANDSCAPING BY EVAN',
  contractorAddress: '456 JULIA LANE, SAULT STE. MARIE, ON, P6A5X6, CA',
  contractorNAICSCodes: [
    {
      code: '561730',
      codeDescription: 'Landscaping services',
      classKey: 'M',
      className: 'ADMINISTRATION, SERVICES TO BUILDINGS, DWELLINGS, AND OPEN SPACES'
    }
  ],
  clearanceCertificateNumber: 'A000012345',
  validityPeriodStart: 2021-02-20T00:00:00.000Z,
  validityPeriodEnd: 2021-05-19T00:00:00.000Z,
  principalLegalTradeName: 'Valid for all principals',
  principalAddress: 'Not applicable',
  certificateURL: 'https://onlineservices.wsib.on.ca/EClearanceWeb/eclearance/GCSearchCertDet12345678'
}
```
