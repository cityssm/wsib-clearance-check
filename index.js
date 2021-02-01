"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClearanceByAccountNumber = exports.cleanRawCertificateOutput = void 0;
const puppeteer = require("puppeteer");
const htmlparser = require("htmlparser2");
const config = require("./config");
const parsers = require("./parsers");
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
exports.cleanRawCertificateOutput = cleanRawCertificateOutput;
const getClearanceByAccountNumber = (accountNumber) => __awaiter(void 0, void 0, void 0, function* () {
    let browser;
    try {
        browser = yield puppeteer.launch();
        const page = yield browser.newPage();
        const pageResponse = yield page.goto(config.clearanceStart_url, {
            referer: "https://www.wsib.ca/en"
        });
        if (!pageResponse.ok) {
            throw new Error("Response Code = " + pageResponse.status().toString());
        }
        yield page.waitForSelector("body");
        yield page.$eval(config.clearanceStart_searchFieldSelector, (inputEle, accountNumber_value) => {
            inputEle.value = accountNumber_value;
        }, accountNumber);
        yield page.$eval(config.clearanceStart_searchFormSelector, (formEle) => {
            formEle.submit();
        });
        yield page.waitForSelector("body");
        yield page.$eval(config.clearanceResult_certificateLinkSelector, (linkEle) => {
            linkEle.click();
        })
            .catch(() => {
            throw new Error("Clearance certificate link not found.");
        });
        yield page.waitForSelector("body");
        const parsedTable = yield page.$eval(config.certificate_tableSelector, (tableEle) => {
            const parsedTable_value = {};
            const thEles = tableEle.querySelectorAll("thead tr th");
            const tdEles = tableEle.querySelectorAll("tbody tr td");
            thEles.forEach((thEle, index) => {
                parsedTable_value[thEle.innerText] = tdEles[index].innerHTML;
            });
            return parsedTable_value;
        });
        const certificate = exports.cleanRawCertificateOutput(parsedTable);
        const response = Object.assign(certificate, {
            success: true,
            accountNumber
        });
        return response;
    }
    catch (e) {
        return {
            success: false,
            accountNumber,
            error: e
        };
    }
    finally {
        try {
            yield browser.close();
        }
        catch (_e) { }
    }
});
exports.getClearanceByAccountNumber = getClearanceByAccountNumber;
