import * as browserGlobal from './browserGlobal.js';
import * as config from './config.js';
import * as parsers from './parsers.js';
function cleanRawCertificateOutput(rawOutput) {
    const contractorLegalTradeName = parsers.stripHTML(rawOutput[config.certificateField_contractorLegalTradeName]);
    const contractorAddress = parsers.stripHTML(rawOutput[config.certificateField_contractorAddress]);
    const contractorNAICSCodes = parsers.parseNAICS(rawOutput[config.certificateField_naicsCodes]);
    const clearanceCertificateNumber = parsers
        .stripHTML(rawOutput[config.certificateField_clearanceCertificateNumber])
        .split(' ')[0];
    const validityPeriod = parsers.parseValidityPeriod(rawOutput[config.certificateField_validityPeriod]);
    const principalLegalTradeName = parsers.stripHTML(rawOutput[config.certificateField_principalLegalTradeName]);
    const principalAddress = parsers.stripHTML(rawOutput[config.certificateField_principalAddress]);
    return {
        contractorLegalTradeName,
        contractorAddress,
        contractorNAICSCodes,
        clearanceCertificateNumber,
        validityPeriodStart: validityPeriod.start,
        validityPeriodEnd: validityPeriod.end,
        principalLegalTradeName,
        principalAddress
    };
}
/**
 * Retrieves a WSIB clearance certificate from the WSIB website.
 * @param accountNumber - The WSIB account number
 * @returns The WSIB clearance certificate data.
 */
export async function getClearanceByAccountNumber(accountNumber) {
    let page;
    try {
        const browser = await browserGlobal.getBrowserGlobal();
        page = await browser.newPage();
        // Set up page options
        page.setDefaultNavigationTimeout(browserGlobal.pageTimeoutMillis);
        page.setDefaultTimeout(browserGlobal.pageTimeoutMillis);
        await page.setExtraHTTPHeaders({
            'Accept-Language': 'en'
        });
        // Load eservice
        const pageResponse = await page.goto(config.clearanceStart_url, {
            referer: 'https://www.wsib.ca/en',
            waitUntil: 'domcontentloaded'
        });
        if (!(pageResponse?.ok() ?? false)) {
            throw new Error(`Response Code = ${pageResponse?.status().toString()}`);
        }
        browserGlobal.keepBrowserGlobalAlive();
        await page.waitForSelector('body');
        // Fill out form
        await page.$eval(config.clearanceStart_searchFieldSelector, (inputElement, accountNumberValue) => {
            inputElement.value = accountNumberValue;
        }, accountNumber);
        await page.$eval(config.clearanceStart_searchFormSelector, (formElement) => {
            formElement.submit();
        });
        browserGlobal.keepBrowserGlobalAlive();
        await page.waitForSelector('body');
        // Find result link
        let hasError = false;
        await page
            .$eval(config.clearanceResult_certificateLinkSelector, (linkElement) => {
            linkElement.click();
        })
            .catch(() => {
            hasError = true;
        });
        if (hasError) {
            const errorMessage = await page
                .$eval(config.clearanceResult_certificateBadStandingSelector, (badStandingElement) => badStandingElement
                ? badStandingElement.textContent
                : config.clearanceResult_defaultErrorMessage)
                .catch(() => {
                throw new Error(config.clearanceResult_defaultErrorMessage);
            });
            throw new Error(errorMessage ?? '');
        }
        browserGlobal.keepBrowserGlobalAlive();
        await page.waitForSelector('body');
        // Parse the certificate
        const certificateURL = page.url();
        const parsedTable = await page.$eval(config.certificate_tableSelector, (tableElement) => {
            const parsedTableValue = {};
            const thElements = tableElement.querySelectorAll('thead tr th');
            const tdElements = tableElement.querySelectorAll('tbody tr td');
            for (const [index, thElement] of thElements.entries()) {
                parsedTableValue[thElement.textContent ?? ''] =
                    tdElements[index].innerHTML;
            }
            return parsedTableValue;
        });
        const certificate = cleanRawCertificateOutput(parsedTable);
        return {
            success: true,
            accountNumber,
            ...certificate,
            certificateURL
        };
    }
    catch (error) {
        let errorURL = '';
        try {
            errorURL = page?.url() ?? '';
        }
        catch {
            // ignore
        }
        return {
            success: false,
            accountNumber,
            error,
            errorURL
        };
    }
    finally {
        try {
            if (page !== undefined) {
                await page.close();
            }
        }
        catch {
            // ignore
        }
    }
}
/**
 * Closes the cached web browser.
 */
export async function cleanUpBrowser() {
    await browserGlobal.cleanUpBrowserGlobal(true);
}
export default getClearanceByAccountNumber;
