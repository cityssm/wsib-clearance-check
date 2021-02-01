import * as puppeteer from "puppeteer";
import * as htmlparser from "htmlparser2";

import * as config from "./config";
import * as parsers from "./parsers";

import type * as types from "./types";


const stripHTML = (rawHTMLString: string): string => {

  const cleanString = (rawHTMLString || "").trim();

  if (cleanString.charAt(0) === "<") {

    const rawNode = htmlparser.parseDocument(cleanString);
    return ((rawNode.firstChild as unknown as Element).children[0] as unknown as Text).data;
  }

  return cleanString;
};


export const cleanRawCertificateOutput = (rawOutput: {}): types.WSIBClearance_Certificate => {

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


export const getClearanceByAccountNumber = async (accountNumber: string): Promise<types.WSIBClearance_Failure | types.WSIBClearance_Success> => {

  let browser: puppeteer.Browser;

  try {
    browser = await puppeteer.launch();

    const page = await browser.newPage();

    // Load eservice

    const pageResponse = await page.goto(config.clearanceStart_url, {
      referer: "https://www.wsib.ca/en"
    });

    if (!pageResponse.ok) {
      throw new Error("Response Code = " + pageResponse.status().toString());
    }

    await page.waitForSelector("body");

    // Fill out form

    await page.$eval(config.clearanceStart_searchFieldSelector, (inputEle: HTMLTextAreaElement, accountNumber_value) => {
      inputEle.value = accountNumber_value;
    }, accountNumber);

    await page.$eval(config.clearanceStart_searchFormSelector, (formEle: HTMLFormElement) => {
      formEle.submit();
    });

    await page.waitForSelector("body");

    // Find result link

    await page.$eval(config.clearanceResult_certificateLinkSelector, (linkEle: HTMLAnchorElement) => {
      linkEle.click();
    })
    .catch(() => {
      throw new Error("Clearance certificate link not found.");
    });

    await page.waitForSelector("body");

    // Parse the certificate

    const parsedTable = await page.$eval(config.certificate_tableSelector, (tableEle: HTMLTableElement) => {

      const parsedTable_value = {};

      const thEles: NodeListOf<HTMLTableCellElement> = tableEle.querySelectorAll("thead tr th");
      const tdEles: NodeListOf<HTMLTableCellElement> = tableEle.querySelectorAll("tbody tr td");

      thEles.forEach((thEle, index) => {
        parsedTable_value[thEle.innerText] = tdEles[index].innerHTML;
      });

      return parsedTable_value;
    });

    const certificate = cleanRawCertificateOutput(parsedTable);

    const response = Object.assign(certificate, {
      success: true,
      accountNumber
    });

    return response;

  } catch (e) {

    return {
      success: false,
      accountNumber,
      error: e
    };

  } finally {
    try {
      await browser.close();
    } catch (_e) { }
  }


};
