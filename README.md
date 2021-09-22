# wsib-clearance-check

[![npm (scoped)](https://img.shields.io/npm/v/@cityssm/wsib-clearance-check)](https://www.npmjs.com/package/@cityssm/wsib-clearance-check)
[![Codacy grade](https://img.shields.io/codacy/grade/ac5c43ebb90748bc86dbb3f1fbaff970)](https://app.codacy.com/gh/cityssm/wsib-clearance-check/dashboard)
[![Code Climate maintainability](https://img.shields.io/codeclimate/maintainability/cityssm/wsib-clearance-check)](https://codeclimate.com/github/cityssm/wsib-clearance-check)
[![Code Climate coverage](https://img.shields.io/codeclimate/coverage/cityssm/wsib-clearance-check)](https://codeclimate.com/github/cityssm/wsib-clearance-check)
[![AppVeyor](https://img.shields.io/appveyor/build/dangowans/wsib-clearance-check)](https://ci.appveyor.com/project/dangowans/wsib-clearance-check)
[![Snyk Vulnerabilities for GitHub Repo](https://img.shields.io/snyk/vulnerabilities/github/cityssm/wsib-clearance-check)](https://app.snyk.io/org/cityssm/project/18c6a1c4-1d7a-4161-85e4-003bfe84a57f)

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
