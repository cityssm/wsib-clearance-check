import puppeteer from "puppeteer";
import htmlparser from "htmlparser2";
import * as config from "./config.js";
import * as parsers from "./parsers.js";
const stripHTML = (rawHTMLString) => {
    const cleanString = (rawHTMLString || "").trim();
    if (cleanString.charAt(0) === "<") {
        const rawNode = htmlparser.parseDocument(cleanString);
        return rawNode.firstChild.children[0].data;
    }
    return cleanString;
};
const cleanRawCertificateOutput = (rawOutput) => {
    const contractorLegalTradeName = stripHTML(rawOutput[config.certificateField_contractorLegalTradeName]);
    const contractorAddress = stripHTML(rawOutput[config.certificateField_contractorAddress]);
    const contractorNAICSCodes = parsers.parseNAICS(rawOutput[config.certificateField_naicsCodes]);
    const clearanceCertificateNumber = stripHTML(rawOutput[config.certificateField_clearanceCertificateNumber]);
    const validityPeriod = parsers.parseValidityPeriod(rawOutput[config.certificateField_validityPeriod]);
    const principalLegalTradeName = stripHTML(rawOutput[config.certificateField_principalLegalTradeName]);
    const principalAddress = stripHTML(rawOutput[config.certificateField_principalAddress]);
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
    let browser;
    let page;
    try {
        browser = await puppeteer.launch();
        page = await browser.newPage();
        const pageResponse = await page.goto(config.clearanceStart_url, {
            referer: "https://www.wsib.ca/en"
        });
        if (!pageResponse.ok) {
            throw new Error("Response Code = " + pageResponse.status().toString());
        }
        await page.waitForSelector("body");
        await page.$eval(config.clearanceStart_searchFieldSelector, (inputEle, accountNumber_value) => {
            inputEle.value = accountNumber_value;
        }, accountNumber);
        await page.$eval(config.clearanceStart_searchFormSelector, (formEle) => {
            formEle.submit();
        });
        await page.waitForSelector("body");
        await page.$eval(config.clearanceResult_certificateLinkSelector, (linkEle) => {
            linkEle.click();
        })
            .catch(() => {
            throw new Error("Clearance certificate link not found.");
        });
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
        const response = Object.assign(certificate, {
            success: true,
            accountNumber,
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
        try {
            await browser.close();
        }
        catch (_b) {
        }
    }
};
export default getClearanceByAccountNumber;
