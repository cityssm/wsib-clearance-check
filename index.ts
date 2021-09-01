import puppeteer from "puppeteer";
import htmlparser from "htmlparser2";

import * as config from "./config.js";
import * as parsers from "./parsers.js";

import type * as types from "./types";


const stripHTML = (rawHTMLString: string): string => {

  const cleanString = (rawHTMLString || "").trim();

  if (cleanString.charAt(0) === "<") {

    const rawNode = htmlparser.parseDocument(cleanString);
    return ((rawNode.firstChild as unknown as Element).children[0] as unknown as Text).data;
  }

  return cleanString;
};


const cleanRawCertificateOutput = (rawOutput: Record<string, unknown>): types.WSIBClearance_Certificate => {

  const contractorLegalTradeName = stripHTML(rawOutput[config.certificateField_contractorLegalTradeName] as string);
  const contractorAddress = stripHTML(rawOutput[config.certificateField_contractorAddress] as string);

  const contractorNAICSCodes = parsers.parseNAICS(rawOutput[config.certificateField_naicsCodes] as string);

  const clearanceCertificateNumber = stripHTML(rawOutput[config.certificateField_clearanceCertificateNumber] as string);

  const validityPeriod = parsers.parseValidityPeriod(rawOutput[config.certificateField_validityPeriod] as string);

  const principalLegalTradeName = stripHTML(rawOutput[config.certificateField_principalLegalTradeName] as string);
  const principalAddress = stripHTML(rawOutput[config.certificateField_principalAddress] as string);

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
  let page: puppeteer.Page;

  try {
    browser = await puppeteer.launch();

    page = await browser.newPage();

    // Load eservice

    const pageResponse = await page.goto(config.clearanceStart_url, {
      referer: "https://www.wsib.ca/en"
    });

    if (!pageResponse.ok) {
      throw new Error("Response Code = " + pageResponse.status().toString());
    }

    await page.waitForSelector("body");

    // Fill out form

    await page.$eval(config.clearanceStart_searchFieldSelector, (inputEle: HTMLTextAreaElement, accountNumber_value: string) => {
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

    const certificateURL = page.url();

    const parsedTable = await page.$eval(config.certificate_tableSelector, (tableEle: HTMLTableElement) => {

      const parsedTable_value = {};

      const thEles: NodeListOf<HTMLTableCellElement> = tableEle.querySelectorAll("thead tr th");
      const tdEles: NodeListOf<HTMLTableCellElement> = tableEle.querySelectorAll("tbody tr td");

      for (const [index, thEle] of thEles.entries()) {
        parsedTable_value[thEle.textContent] = tdEles[index].innerHTML;
      }

      return parsedTable_value;
    });

    const certificate = cleanRawCertificateOutput(parsedTable);

    const response = Object.assign({
      success: true,
      accountNumber,
      certificateURL
    }, certificate);

    return response;

  } catch (error) {

    let errorURL: string;

    try {
      errorURL = page.url();
    } catch {
      // ignore
    }

    return {
      success: false,
      accountNumber,
      error: error,
      errorURL
    };

  } finally {
    try {
      await browser.close();
    } catch {
      // ignore
    }
  }
};


export default getClearanceByAccountNumber;
