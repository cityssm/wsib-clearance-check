import { setIntervalAsync } from "set-interval-async/dynamic/index.js";
import { clearIntervalAsync } from "set-interval-async";
import puppeteer from "puppeteer";
let headless = true;
export const setHeadless = (headlessStatus) => {
    headless = headlessStatus;
};
export const pageTimeoutMillis = 90000;
const browserStartupTimeoutMillis = 3 * 60000;
const browserGlobalExpiryMillis = browserStartupTimeoutMillis + (pageTimeoutMillis * 3);
let browserGlobal;
let browserGlobalInitializedTime = 0;
let browserGlobalTimer;
const isBrowserGlobalExpired = () => {
    if (browserGlobalInitializedTime + browserGlobalExpiryMillis < Date.now()) {
        return true;
    }
    return false;
};
export const initializeBrowserGlobal = async () => {
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
export const cleanUpBrowserGlobal = async (useForce = false) => {
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
