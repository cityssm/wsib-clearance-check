import { setIntervalAsync } from "set-interval-async/dynamic/index.js";
import { clearIntervalAsync } from "set-interval-async";
import type { SetIntervalAsyncTimer } from "set-interval-async";

import puppeteer from "puppeteer";

/*
 * Headless Debug Setting
 */

let headless = true;

export const setHeadless = (headlessStatus: boolean): void => {
  headless = headlessStatus;
};

/*
 * Browser Global
 */

export const pageTimeoutMillis = 90_000;
const browserStartupTimeoutMillis = 3 * 60_000;

const browserGlobalExpiryMillis = browserStartupTimeoutMillis + (pageTimeoutMillis * 3);

let browserGlobal: puppeteer.Browser;
let browserGlobalInitializedTime = 0;
let browserGlobalTimer: SetIntervalAsyncTimer;

const isBrowserGlobalExpired = () => {

  if (browserGlobalInitializedTime + browserGlobalExpiryMillis < Date.now()) {
    return true;
  }

  return false;
};

export const initializeBrowserGlobal = async (): Promise<puppeteer.Browser> => {

  if (!browserGlobal || isBrowserGlobalExpired()) {

    await cleanUpBrowserGlobal();

    browserGlobalInitializedTime = Date.now();

    browserGlobal = await puppeteer.launch({
      headless,
      timeout: browserStartupTimeoutMillis,
      args: ["--lang-en-CA,en"]
    });


    browserGlobalTimer = setIntervalAsync(cleanUpBrowserGlobal, browserGlobalExpiryMillis);
  }

  return browserGlobal;
};

export const cleanUpBrowserGlobal = async (useForce = false): Promise<void> => {

  if (useForce) {
    browserGlobalInitializedTime = 0;
  }

  if (browserGlobal && isBrowserGlobalExpired()) {

    await browserGlobal.close();
    browserGlobal = undefined;

    if (browserGlobalTimer) {
      clearIntervalAsync(browserGlobalTimer);
      browserGlobalTimer = undefined;
    }

    browserGlobalInitializedTime = 0;
  }
};
