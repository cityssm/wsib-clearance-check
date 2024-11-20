import assert from 'node:assert';
import { after, before, describe, it } from 'node:test';
import * as wsib from '../index.js';
import { getWSIBClassificationFromNAICSCode } from '../wsibClassifications.js';
await describe('getClearanceByAccountNumber(validAccountNumber)', async () => {
    let certificate;
    const accountNumber = '9001832';
    before(async () => {
        try {
            certificate = (await wsib.getClearanceByAccountNumber(accountNumber));
            console.log(certificate);
        }
        catch (error) {
            console.log(error);
            assert.fail();
        }
    });
    after(async () => {
        await wsib.cleanUpBrowser();
    });
    await it('Returns { success: true } on a valid WSIB account number', () => {
        assert.strictEqual(certificate.success, true);
    });
    await it('Echos accountNumber', () => {
        assert.strictEqual(certificate.accountNumber, accountNumber);
    });
    await it('Returns an alphanumeric certificate number', () => {
        assert.match(certificate.clearanceCertificateNumber, /^[\dA-Z]+$/);
    });
    await it('Returns a Date for validityPeriodStart', () => {
        assert.strictEqual(certificate.validityPeriodStart.constructor, Date);
    });
    await it('Returns a Date for validityPeriodEnd', () => {
        assert.strictEqual(certificate.validityPeriodEnd.constructor, Date);
    });
});
// eslint-disable-next-line no-secrets/no-secrets
await describe('getClearanceByAccountNumber(invalidAccountNumber)', async () => {
    let certificate;
    before(async () => {
        try {
            certificate = (await wsib.getClearanceByAccountNumber('1'));
            console.log(certificate);
        }
        catch (error) {
            console.log(error);
            assert.fail();
        }
    });
    after(async () => {
        await wsib.cleanUpBrowser();
    });
    await it('Returns { success: false } on an invalid WSIB account number', () => {
        assert.strictEqual(certificate.success, false);
    });
});
// eslint-disable-next-line no-secrets/no-secrets
await describe('getWSIBClassificationFromNAICSCode', async () => {
    await it("Returns { subclassName: 'Hospitals' } on naicsCode = '622000'", () => {
        try {
            const result = getWSIBClassificationFromNAICSCode('622000');
            assert.strictEqual(result?.subclassName, 'Hospitals');
        }
        catch (error) {
            console.log(error);
            assert.fail();
        }
    });
});
