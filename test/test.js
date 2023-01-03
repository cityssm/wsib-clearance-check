import assert from "assert";
import * as wsib from "../index.js";
import { getWSIBClassificationFromNAICSCode } from "../wsib-classifications.js";
describe("getClearanceByAccountNumber(validAccountNumber)", () => {
    let certificate;
    const accountNumber = "9001832";
    before(async () => {
        try {
            certificate = (await wsib.getClearanceByAccountNumber(accountNumber));
            console.log(certificate);
        }
        catch (error) {
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
describe("getClearanceByAccountNumber(invalidAccountNumber)", async () => {
    let certificate;
    before(async () => {
        try {
            certificate = (await wsib.getClearanceByAccountNumber("1"));
            console.log(certificate);
        }
        catch (error) {
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
        }
        catch (error) {
            assert.fail(error);
        }
    });
});
