import exitHook from "exit-hook";
import * as browserGlobal from "./browser-global.js";
import * as config from "./config.js";
import * as parsers from "./parsers.js";
export const setHeadless = (headlessStatus) => {
    browserGlobal.setHeadless(headlessStatus);
};
const cleanRawCertificateOutput = (rawOutput) => {
    const contractorLegalTradeName = parsers.stripHTML(rawOutput[config.certificateField_contractorLegalTradeName]);
    const contractorAddress = parsers.stripHTML(rawOutput[config.certificateField_contractorAddress]);
    const contractorNAICSCodes = parsers.parseNAICS(rawOutput[config.certificateField_naicsCodes]);
    const clearanceCertificateNumber = parsers.stripHTML(rawOutput[config.certificateField_clearanceCertificateNumber]).split(" ")[0];
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
};
export const getClearanceByAccountNumber = async (accountNumber) => {
    let page;
    try {
        const browser = await browserGlobal.getBrowserGlobal();
        page = await browser.newPage();
        page.setDefaultNavigationTimeout(browserGlobal.pageTimeoutMillis);
        page.setDefaultTimeout(browserGlobal.pageTimeoutMillis);
        await page.setExtraHTTPHeaders({
            "Accept-Language": "en"
        });
        const pageResponse = await page.goto(config.clearanceStart_url, {
            referer: "https://www.wsib.ca/en",
            waitUntil: "domcontentloaded"
        });
        if (!pageResponse.ok) {
            throw new Error("Response Code = " + pageResponse.status().toString());
        }
        browserGlobal.keepBrowserGlobalAlive();
        await page.waitForSelector("body");
        await page.$eval(config.clearanceStart_searchFieldSelector, (inputEle, accountNumber_value) => {
            inputEle.value = accountNumber_value;
        }, accountNumber);
        await page.$eval(config.clearanceStart_searchFormSelector, (formEle) => {
            formEle.submit();
        });
        browserGlobal.keepBrowserGlobalAlive();
        await page.waitForSelector("body");
        let hasError = false;
        await page.$eval(config.clearanceResult_certificateLinkSelector, (linkEle) => {
            linkEle.click();
        })
            .catch(() => {
            hasError = true;
        });
        if (hasError) {
            const errorMessage = await page.$eval(config.clearanceResult_certificateBadStandingSelector, (badStandingEle) => {
                return badStandingEle
                    ? badStandingEle.textContent
                    : config.clearanceResult_defaultErrorMessage;
            })
                .catch(() => {
                throw new Error(config.clearanceResult_defaultErrorMessage);
            });
            throw new Error(errorMessage);
        }
        browserGlobal.keepBrowserGlobalAlive();
        await page.waitForSelector("body");
        const certificateURL = page.url();
        const parsedTable = await page.$eval(config.certificate_tableSelector, (tableEle) => {
            const parsedTable_value = {};
            const thEles = tableEle.querySelectorAll("thead tr th");
            const tdEles = tableEle.querySelectorAll("tbody tr td");
            for (const [index, thEle] of thEles.entries()) {
                parsedTable_value[thEle.textContent] = tdEles[index].innerHTML;
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
        catch (_a) {
        }
        return {
            success: false,
            accountNumber,
            error: error,
            errorURL
        };
    }
    finally {
        await page.close();
    }
};
export const cleanUpBrowser = async () => {
    await browserGlobal.cleanUpBrowserGlobal(true);
};
export default getClearanceByAccountNumber;
exitHook(cleanUpBrowser);
