import exitHook from 'exit-hook';
import * as browserGlobal from './browserGlobal.js';
import * as config from './config.js';
import * as parsers from './parsers.js';
export function setHeadless(headlessStatus) {
    browserGlobal.setHeadless(headlessStatus);
}
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
export async function getClearanceByAccountNumber(accountNumber) {
    let page;
    try {
        const browser = await browserGlobal.getBrowserGlobal();
        page = await browser.newPage();
        page.setDefaultNavigationTimeout(browserGlobal.pageTimeoutMillis);
        page.setDefaultTimeout(browserGlobal.pageTimeoutMillis);
        await page.setExtraHTTPHeaders({
            'Accept-Language': 'en'
        });
        const pageResponse = await page.goto(config.clearanceStart_url, {
            referer: 'https://www.wsib.ca/en',
            waitUntil: 'domcontentloaded'
        });
        if (!pageResponse.ok) {
            throw new Error('Response Code = ' + pageResponse.status().toString());
        }
        browserGlobal.keepBrowserGlobalAlive();
        await page.waitForSelector('body');
        await page.$eval(config.clearanceStart_searchFieldSelector, (inputElement, accountNumberValue) => {
            inputElement.value = accountNumberValue;
        }, accountNumber);
        await page.$eval(config.clearanceStart_searchFormSelector, (formElement) => {
            formElement.submit();
        });
        browserGlobal.keepBrowserGlobalAlive();
        await page.waitForSelector('body');
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
                .$eval(config.clearanceResult_certificateBadStandingSelector, (badStandingElement) => {
                return badStandingElement
                    ? badStandingElement.textContent
                    : config.clearanceResult_defaultErrorMessage;
            })
                .catch(() => {
                throw new Error(config.clearanceResult_defaultErrorMessage);
            });
            throw new Error(errorMessage);
        }
        browserGlobal.keepBrowserGlobalAlive();
        await page.waitForSelector('body');
        const certificateURL = page.url();
        const parsedTable = await page.$eval(config.certificate_tableSelector, (tableElement) => {
            const parsedTable_value = {};
            const thElements = tableElement.querySelectorAll('thead tr th');
            const tdElements = tableElement.querySelectorAll('tbody tr td');
            for (const [index, thElement] of thElements.entries()) {
                parsedTable_value[thElement.textContent] = tdElements[index].innerHTML;
            }
            return parsedTable_value;
        });
        const certificate = cleanRawCertificateOutput(parsedTable);
        const response = Object.assign({
            success: true,
            accountNumber
        }, certificate, {
            certificateURL
        });
        return response;
    }
    catch (error) {
        let errorURL;
        try {
            errorURL = page.url();
        }
        catch {
        }
        return {
            success: false,
            accountNumber,
            error: error,
            errorURL
        };
    }
    finally {
        try {
            await page.close();
        }
        catch {
        }
    }
}
export async function cleanUpBrowser() {
    await browserGlobal.cleanUpBrowserGlobal(true);
}
export default getClearanceByAccountNumber;
exitHook(cleanUpBrowser);
