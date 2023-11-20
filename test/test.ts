import assert from 'node:assert'

import * as wsib from '../index.js'
import type { WSIBClearance_Failure, WSIBClearance_Success } from '../types.js'
import { getWSIBClassificationFromNAICSCode } from '../wsibClassifications.js'

describe('getClearanceByAccountNumber(validAccountNumber)', () => {
  let certificate: WSIBClearance_Success
  const accountNumber = '9001832'

  before(async () => {
    try {
      certificate = (await wsib.getClearanceByAccountNumber(
        accountNumber
      )) as WSIBClearance_Success
      console.log(certificate)
    } catch (error) {
      assert.fail(error)
    }
  })

  after(async () => {
    await wsib.cleanUpBrowser()
  })

  it('Returns { success: true } on a valid WSIB account number', () => {
    assert.strictEqual(certificate.success, true)
  })

  it('Echos accountNumber', () => {
    assert.strictEqual(certificate.accountNumber, accountNumber)
  })

  it('Returns an alphanumeric certificate number', () => {
    assert.match(certificate.clearanceCertificateNumber, /^[\dA-Z]+$/)
  })

  it('Returns a Date for validityPeriodStart', () => {
    assert.strictEqual(certificate.validityPeriodStart.constructor, Date)
  })

  it('Returns a Date for validityPeriodEnd', () => {
    assert.strictEqual(certificate.validityPeriodEnd.constructor, Date)
  })
})

// eslint-disable-next-line @typescript-eslint/no-misused-promises
describe('getClearanceByAccountNumber(invalidAccountNumber)', async () => {
  let certificate: WSIBClearance_Failure

  before(async () => {
    try {
      certificate = (await wsib.getClearanceByAccountNumber(
        '1'
      )) as WSIBClearance_Failure
      console.log(certificate)
    } catch (error) {
      assert.fail(error)
    }
  })

  after(async () => {
    await wsib.cleanUpBrowser()
  })

  it('Returns { success: false } on an invalid WSIB account number', () => {
    assert.strictEqual(certificate.success, false)
  })
})

describe('getWSIBClassificationFromNAICSCode', () => {
  it("Returns { subclassName: 'Hospitals' } on naicsCode = '622000'", async () => {
    try {
      const result = getWSIBClassificationFromNAICSCode('622000')
      assert.strictEqual(result.subclassName, 'Hospitals')
    } catch (error) {
      assert.fail(error)
    }
  })
})
