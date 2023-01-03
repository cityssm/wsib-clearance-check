import assert from "assert";
import * as wsib from "../index.js";
import { getWSIBClassificationFromNAICSCode } from "../wsib-classifications.js";

import type * as wsibTypes from "../types";

describe("getClearanceByAccountNumber(validAccountNumber)", () => {
    let certificate: wsibTypes.WSIBClearance_Success;
    const accountNumber = "9001832";

    before(async () => {
        try {
            certificate = (await wsib.getClearanceByAccountNumber(
                accountNumber
            )) as wsibTypes.WSIBClearance_Success;
            console.log(certificate);
        } catch (error) {
            assert.fail(error);
        }
    });

    after(() => {
        wsib.cleanUpBrowser();
    });

    it("Returns { success: true } on a valid WSIB account number", () => {
        assert.strictEqual(certificate.success, true);
    });

    it("Echos accountNumber", () => {
        assert.strictEqual(certificate.accountNumber, accountNumber);
    });

    it("Returns an alphanumeric certificate number", () => {
        assert.match(certificate.clearanceCertificateNumber, /^[\dA-Z]+$/);
    });

    it("Returns a Date for validityPeriodStart", () => {
        assert.strictEqual(certificate.validityPeriodStart.constructor, Date);
    });

    it("Returns a Date for validityPeriodEnd", () => {
        assert.strictEqual(certificate.validityPeriodEnd.constructor, Date);
    });
});

// eslint-disable-next-line @typescript-eslint/no-misused-promises
describe("getClearanceByAccountNumber(invalidAccountNumber)", async () => {
    let certificate: wsibTypes.WSIBClearance_Failure;

    before(async () => {
        try {
            certificate = (await wsib.getClearanceByAccountNumber(
                "1"
            )) as wsibTypes.WSIBClearance_Failure;
            console.log(certificate);
        } catch (error) {
            assert.fail(error);
        }
    });

    after(() => {
        wsib.cleanUpBrowser();
    });

    it("Returns { success: false } on an invalid WSIB account number", () => {
        assert.strictEqual(certificate.success, false);
    });
});

describe("getWSIBClassificationFromNAICSCode", () => {
    it("Returns { subclassName: 'Hospitals' } on naicsCode = '622000'", async () => {
        try {
            const result = getWSIBClassificationFromNAICSCode("622000");
            assert.strictEqual(result.subclassName, "Hospitals");
        } catch (error) {
            assert.fail(error);
        }
    });
});
