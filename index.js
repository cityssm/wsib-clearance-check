import { GlobalBrowser } from '@cityssm/puppeteer-launch/globalBrowser';
import exitHook from 'exit-hook';
import * as config from './config.js';
import * as parsers from './parsers.js';
// eslint-disable-next-line @typescript-eslint/no-magic-numbers
const browserGlobal = new GlobalBrowser({}, 10_000);
async function wait(ms) {
    // eslint-disable-next-line promise/avoid-new
    await new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
function cleanRawCertificateOutput(rawOutput) {
    const contractorLegalTradeName = parsers.stripHTML(rawOutput[config.certificateField_contractorLegalTradeName]);
    const contractorAddress = parsers.stripHTML(rawOutput[config.certificateField_contractorAddress]);
    const contractorNAICSCodes = parsers.parseNAICS(rawOutput[config.certificateField_naicsCodes]);
    const clearanceCertificateNumber = parsers
        .stripHTML(rawOutput[config.certificateField_clearanceCertificateNumber])
        .split(' ', 1)[0];
    const validityPeriod = parsers.parseValidityPeriod(rawOutput[config.certificateField_validityPeriod]);
    const principalLegalTradeName = parsers.stripHTML(rawOutput[config.certificateField_principalLegalTradeName]);
    const principalAddress = parsers.stripHTML(rawOutput[config.certificateField_principalAddress]);
    return {
        clearanceCertificateNumber,
        contractorLegalTradeName,
        contractorNAICSCodes,
        contractorAddress,
        validityPeriodEnd: validityPeriod.end,
        validityPeriodStart: validityPeriod.start,
        principalAddress,
        principalLegalTradeName
    };
}
/**
 * Retrieves a WSIB clearance certificate from the WSIB website.
 * @param accountNumber - The WSIB account number
 * @returns The WSIB clearance certificate data.
 * @throws {Error} When the WSIB website is not available or returns an error response.
 */
export async function getClearanceByAccountNumber(accountNumber) {
    // eslint-disable-next-line @typescript-eslint/init-declarations
    let page;
    try {
        const browser = await browserGlobal.getBrowser();
        page = await browser.newPage();
        // Set up page options
        page.setDefaultNavigationTimeout(config.pageTimeoutMillis);
        page.setDefaultTimeout(config.pageTimeoutMillis);
        await page.setExtraHTTPHeaders({
            'Accept-Language': 'en'
        });
        // Load eService
        const pageResponse = await page.goto(config.clearanceStart_url, {
            referer: 'https://www.wsib.ca/en',
            waitUntil: 'domcontentloaded'
        });
        if (!(pageResponse?.ok() ?? false)) {
            throw new Error(`Response Code = ${pageResponse?.status().toString()}`, {
                cause: pageResponse?.status()
            });
        }
        await page.waitForSelector('body');
        await page.waitForSelector(config.clearanceStart_searchFieldSelector);
        // Fill out form
        await page.$eval(config.clearanceStart_searchFieldSelector, (inputElement, accountNumberValue) => {
            ;
            inputElement.value =
                accountNumberValue;
        }, accountNumber);
        await page.$eval(config.clearanceStart_searchFormSelector, (formElement) => {
            ;
            formElement.submit();
        });
        // Wait for results to load
        await wait(500);
        await page.waitForSelector('body');
        await page.waitForNetworkIdle();
        // Find result link
        let hasError = false;
        await page
            .$eval(config.clearanceResult_certificateLinkSelector, (linkElement) => {
            linkElement.scrollIntoView();
            linkElement.click();
        })
            .catch(() => {
            hasError = true;
        });
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (hasError) {
            const errorMessage = await page
                .$eval(config.clearanceResult_certificateBadStandingSelector, (badStandingElement) => 
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            badStandingElement
                ? badStandingElement.textContent
                : config.clearanceResult_defaultErrorMessage)
                .catch(() => {
                throw new Error(config.clearanceResult_defaultErrorMessage);
            });
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            throw new Error(errorMessage ?? '');
        }
        await wait(500);
        await page.waitForSelector('body');
        await page.waitForNetworkIdle();
        // Parse the certificate
        const certificateURL = page.url();
        const parsedTable = await page.$eval(config.certificate_tableSelector, (tableElement) => {
            const parsedTableValue = {};
            const thElements = tableElement.querySelectorAll('thead tr th');
            const tdElements = tableElement.querySelectorAll('tbody tr td');
            for (const [index, thElement] of thElements.entries()) {
                parsedTableValue[thElement.textContent] = tdElements[index].innerHTML;
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
        if (error instanceof Error &&
            error.cause !== undefined &&
            typeof error.cause === 'number') {
            throw new Error(`Website Not Available, Response Code = ${error.cause.toString()}`, {
                cause: error
            });
        }
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
            await browserGlobal.releaseBrowser();
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
    await browserGlobal.closeBrowser();
}
exitHook(() => {
    cleanUpBrowser().catch(() => {
        // ignore
    });
});
export default getClearanceByAccountNumber;
