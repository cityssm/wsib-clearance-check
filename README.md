# wsib-clearance-check

[![npm (scoped)](https://img.shields.io/npm/v/@cityssm/wsib-clearance-check)](https://www.npmjs.com/package/@cityssm/wsib-clearance-check) [![Codacy grade](https://img.shields.io/codacy/grade/ac5c43ebb90748bc86dbb3f1fbaff970)](https://app.codacy.com/gh/cityssm/wsib-clearance-check/dashboard) [![Code Climate maintainability](https://img.shields.io/codeclimate/maintainability/cityssm/wsib-clearance-check)](https://codeclimate.com/github/cityssm/wsib-clearance-check) [![Snyk Vulnerabilities for GitHub Repo](https://img.shields.io/snyk/vulnerabilities/github/cityssm/wsib-clearance-check)](https://app.snyk.io/org/cityssm/project/18c6a1c4-1d7a-4161-85e4-003bfe84a57f)

A tool to scrape the clearance certificate status from the WSIB Online Services website.

[WSIB Clearance Certificate Website](https://onlineservices.wsib.on.ca/EClearanceWeb/eclearance/start)

## Installation

```bash
npm install @cityssm/wsib-clearance-check
```

## Usage

```javascript
import * as wsib from "@cityssm/wsib-clearance-check";
// ...
const cert = await wsib.getClearanceByAccountNumber(123);
```
