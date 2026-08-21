import assert from 'node:assert'
import { after, before, describe, it } from 'node:test'

import Debug from 'debug'

import { DEBUG_ENABLE_NAMESPACES, DEBUG_NAMESPACE } from '../debug.config.js'
import * as wsib from '../index.js'
import type { WSIBClearanceCertificateFailure, WSIBClearanceCertificateSuccess } from '../types.js'
import { getWSIBClassificationFromNAICSCode } from '../wsibClassifications.js'

Debug.enable(DEBUG_ENABLE_NAMESPACES)

const debug = Debug(`${DEBUG_NAMESPACE}:test`)

await describe('getClearanceByAccountNumber(validAccountNumber)', async () => {
  let certificate: WSIBClearanceCertificateSuccess
  const accountNumber = '9001832'

  before(async () => {
    try {
      certificate = (await wsib.getClearanceByAccountNumber(
        accountNumber
      )) as WSIBClearanceCertificateSuccess
      debug(certificate)
    } catch (error) {
      debug(error)
      assert.fail()
    }
  })

  after(async () => {
    await wsib.cleanUpBrowser()
  })

  await it('Returns { success: true } on a valid WSIB account number', () => {
    assert.strictEqual(certificate.success, true)
  })

  await it('Echos accountNumber', () => {
    assert.strictEqual(certificate.accountNumber, accountNumber)
  })

  await it('Returns an alphanumeric certificate number', () => {
    assert.match(certificate.clearanceCertificateNumber, /^[\dA-Z]+$/)
  })

  await it('Returns a Date for validityPeriodStart', () => {
    assert.strictEqual(certificate.validityPeriodStart.constructor, Date)
  })

  await it('Returns a Date for validityPeriodEnd', () => {
    assert.strictEqual(certificate.validityPeriodEnd.constructor, Date)
  })
})

await describe('getClearanceByAccountNumber(invalidAccountNumber)', async () => {
  let certificate: WSIBClearanceCertificateFailure

  before(async () => {
    try {
      certificate = (await wsib.getClearanceByAccountNumber(
        '1'
      )) as WSIBClearanceCertificateFailure
      debug(certificate)
    } catch (error) {
      debug(error)
      assert.fail()
    }
  })

  after(async () => {
    await wsib.cleanUpBrowser()
  })

  await it('Returns { success: false } on an invalid WSIB account number', () => {
    assert.strictEqual(certificate.success, false)
  })
})

await describe('getWSIBClassificationFromNAICSCode', async () => {
  await it("Returns { subclassName: 'Hospitals' } on naicsCode = '622000'", () => {
    try {
      const result = getWSIBClassificationFromNAICSCode('622000')
      assert.strictEqual(result?.subclassName, 'Hospitals')
    } catch (error) {
      debug(error)
      assert.fail()
    }
  })
})
