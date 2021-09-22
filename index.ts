import exitHook from "exit-hook";

import * as browserGlobal from "./browser-global.js";

import * as config from "./config.js";
import * as parsers from "./parsers.js";

import type * as puppeteer from "puppeteer";
import type * as types from "./types";


export const setHeadless = (headlessStatus: boolean): void => {
  browserGlobal.setHeadless(headlessStatus);
};


const cleanRawCertificateOutput = (rawOutput: Record<string, unknown>): types.WSIBClearance_Certificate => {

  const contractorLegalTradeName = parsers.stripHTML(rawOutput[config.certificateField_contractorLegalTradeName] as string);
  const contractorAddress = parsers.stripHTML(rawOutput[config.certificateField_contractorAddress] as string);

  const contractorNAICSCodes = parsers.parseNAICS(rawOutput[config.certificateField_naicsCodes] as string);

  const clearanceCertificateNumber = parsers.stripHTML(rawOutput[config.certificateField_clearanceCertificateNumber] as string);

  const validityPeriod = parsers.parseValidityPeriod(rawOutput[config.certificateField_validityPeriod] as string);

  const principalLegalTradeName = parsers.stripHTML(rawOutput[config.certificateField_principalLegalTradeName] as string);
  const principalAddress = parsers.stripHTML(rawOutput[config.certificateField_principalAddress] as string);

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

  let page: puppeteer.Page;

  try {
    const browser = await browserGlobal.initializeBrowserGlobal();

    page = await browser.newPage();

    // Set up page options

    page.setDefaultNavigationTimeout(browserGlobal.pageTimeoutMillis);
    page.setDefaultTimeout(browserGlobal.pageTimeoutMillis);

    await page.setExtraHTTPHeaders({
      "Accept-Language": "en"
    });

    // Load eservice

    const pageResponse = await page.goto(config.clearanceStart_url, {
      referer: "https://www.wsib.ca/en",
      waitUntil: "domcontentloaded"
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
      accountNumber
    }, certificate, {
        certificateURL
      });

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
    await page.close();
  }
};


export const cleanUpBrowser = async (): Promise<void> => {
  await browserGlobal.cleanUpBrowserGlobal(true);
};


export default getClearanceByAccountNumber;


exitHook(cleanUpBrowser);
