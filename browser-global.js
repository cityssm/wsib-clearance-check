import { setIntervalAsync } from "set-interval-async/dynamic";
import { clearIntervalAsync } from "set-interval-async";
import puppeteer from "puppeteer";
let headless = true;
export const setHeadless = (headlessStatus) => {
    headless = headlessStatus;
};
export const pageTimeoutMillis = 90000;
const browserStartupTimeoutMillis = 3 * 60000;
const browserGlobalExpiryMillis = Math.max(browserStartupTimeoutMillis, pageTimeoutMillis) + 10000;
let browserGlobal;
let browserGlobalInitializedTime = 0;
let browserGlobalTimer;
function isBrowserGlobalReady() {
    if (browserGlobal && browserGlobalInitializedTime + browserGlobalExpiryMillis > Date.now()) {
        return true;
    }
    return false;
}
export async function getBrowserGlobal() {
    if (!isBrowserGlobalReady()) {
        await cleanUpBrowserGlobal();
        keepBrowserGlobalAlive();
        browserGlobal = await puppeteer.launch({
            headless,
            timeout: browserStartupTimeoutMillis,
            args: ["--lang-en-CA,en"]
        });
        keepBrowserGlobalAlive();
        browserGlobalTimer = setIntervalAsync(cleanUpBrowserGlobal, browserGlobalExpiryMillis);
    }
    return browserGlobal;
}
export function keepBrowserGlobalAlive() {
    browserGlobalInitializedTime = Date.now();
}
export async function cleanUpBrowserGlobal(useForce = false) {
    if (useForce) {
        browserGlobalInitializedTime = 0;
    }
    if (!isBrowserGlobalReady()) {
        try {
            await browserGlobal.close();
        }
        catch (_a) {
        }
        browserGlobal = undefined;
        if (browserGlobalTimer) {
            try {
                clearIntervalAsync(browserGlobalTimer);
            }
            catch (_b) {
            }
            browserGlobalTimer = undefined;
        }
        browserGlobalInitializedTime = 0;
    }
}
