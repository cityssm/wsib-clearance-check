import type * as puppeteer from 'puppeteer'

import * as browserGlobal from './browserGlobal.js'
import * as config from './config.js'
import * as parsers from './parsers.js'
import type {
  WSIBClearance_Certificate,
  WSIBClearance_Failure,
  WSIBClearance_Success
} from './types.js'

function cleanRawCertificateOutput(
  rawOutput: Record<string, unknown>
): WSIBClearance_Certificate {
  const contractorLegalTradeName = parsers.stripHTML(
    rawOutput[config.certificateField_contractorLegalTradeName] as string
  )
  const contractorAddress = parsers.stripHTML(
    rawOutput[config.certificateField_contractorAddress] as string
  )

  const contractorNAICSCodes = parsers.parseNAICS(
    rawOutput[config.certificateField_naicsCodes] as string
  )

  const clearanceCertificateNumber = parsers
    .stripHTML(
      rawOutput[config.certificateField_clearanceCertificateNumber] as string
    )
    .split(' ')[0]

  const validityPeriod = parsers.parseValidityPeriod(
    rawOutput[config.certificateField_validityPeriod] as string
  )

  const principalLegalTradeName = parsers.stripHTML(
    rawOutput[config.certificateField_principalLegalTradeName] as string
  )
  const principalAddress = parsers.stripHTML(
    rawOutput[config.certificateField_principalAddress] as string
  )

  return {
    contractorLegalTradeName,
    contractorAddress,
    contractorNAICSCodes,
    clearanceCertificateNumber,
    validityPeriodStart: validityPeriod.start as Date,
    validityPeriodEnd: validityPeriod.end as Date,
    principalLegalTradeName,
    principalAddress
  }
}

/**
 * Retrieves a WSIB clearance certificate from the WSIB website.
 * @param {string} accountNumber - The WSIB account number
 * @returns {Promise<WSIBClearance_Failure | WSIBClearance_Success>} - The WSIB clearance certificate data.
 */
export async function getClearanceByAccountNumber(
  accountNumber: string
): Promise<WSIBClearance_Failure | WSIBClearance_Success> {
  let page: puppeteer.Page | undefined

  try {
    const browser = await browserGlobal.getBrowserGlobal()

    page = await browser.newPage()

    // Set up page options
    page.setDefaultNavigationTimeout(browserGlobal.pageTimeoutMillis)
    page.setDefaultTimeout(browserGlobal.pageTimeoutMillis)

    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en'
    })

    // Load eservice
    const pageResponse = await page.goto(config.clearanceStart_url, {
      referer: 'https://www.wsib.ca/en',
      waitUntil: 'domcontentloaded'
    })

    if (!(pageResponse?.ok() ?? false)) {
      throw new Error(`Response Code = ${pageResponse?.status().toString()}`)
    }

    browserGlobal.keepBrowserGlobalAlive()
    await page.waitForSelector('body')

    // Fill out form
    await page.$eval(
      config.clearanceStart_searchFieldSelector,
      (inputElement: HTMLTextAreaElement, accountNumberValue: string) => {
        inputElement.value = accountNumberValue
      },
      accountNumber
    )

    await page.$eval(
      config.clearanceStart_searchFormSelector,
      (formElement: HTMLFormElement) => {
        formElement.submit()
      }
    )

    browserGlobal.keepBrowserGlobalAlive()
    await page.waitForSelector('body')

    // Find result link
    let hasError = false

    await page
      .$eval(
        config.clearanceResult_certificateLinkSelector,
        (linkElement: HTMLAnchorElement) => {
          linkElement.click()
        }
      )
      .catch(() => {
        hasError = true
      })

    if (hasError) {
      const errorMessage = await page
        .$eval(
          config.clearanceResult_certificateBadStandingSelector,
          (badStandingElement: HTMLElement) => {
            return badStandingElement
              ? badStandingElement.textContent
              : config.clearanceResult_defaultErrorMessage
          }
        )
        .catch(() => {
          throw new Error(config.clearanceResult_defaultErrorMessage)
        })

      throw new Error(errorMessage ?? '')
    }

    browserGlobal.keepBrowserGlobalAlive()
    await page.waitForSelector('body')

    // Parse the certificate
    const certificateURL = page.url()

    const parsedTable = await page.$eval(
      config.certificate_tableSelector,
      (tableElement: HTMLTableElement) => {
        const parsedTableValue = {}

        const thElements: NodeListOf<HTMLTableCellElement> =
          tableElement.querySelectorAll('thead tr th')
        const tdElements: NodeListOf<HTMLTableCellElement> =
          tableElement.querySelectorAll('tbody tr td')

        for (const [index, thElement] of thElements.entries()) {
          parsedTableValue[thElement.textContent ?? ''] =
            tdElements[index].innerHTML
        }

        return parsedTableValue
      }
    )

    const certificate = cleanRawCertificateOutput(parsedTable)

    return Object.assign(
      {
        success: true,
        accountNumber
      },
      certificate,
      {
        certificateURL
      }
    )
  } catch (error) {
    let errorURL: string = ''

    try {
      errorURL = page?.url() ?? ''
    } catch {
      // ignore
    }

    return {
      success: false,
      accountNumber,
      error,
      errorURL
    }
  } finally {
    try {
      if (page !== undefined) {
        await page.close()
      }
    } catch {
      // ignore
    }
  }
}

/**
 * Closes the cached web browser.
 */
export async function cleanUpBrowser(): Promise<void> {
  await browserGlobal.cleanUpBrowserGlobal(true)
}

export default getClearanceByAccountNumber
