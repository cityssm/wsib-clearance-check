import puppeteer from 'puppeteer';
import { clearIntervalAsync } from 'set-interval-async';
import { setIntervalAsync } from 'set-interval-async/dynamic';
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
    return Boolean(browserGlobal !== undefined &&
        browserGlobalInitializedTime + browserGlobalExpiryMillis > Date.now());
}
export async function getBrowserGlobal() {
    if (!isBrowserGlobalReady()) {
        await cleanUpBrowserGlobal();
        keepBrowserGlobalAlive();
        browserGlobal = await puppeteer.launch({
            headless: headless ? 'new' : false,
            timeout: browserStartupTimeoutMillis,
            args: ['--lang-en-CA,en']
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
        catch {
        }
        browserGlobal = undefined;
        if (browserGlobalTimer) {
            try {
                await clearIntervalAsync(browserGlobalTimer);
            }
            catch {
            }
            browserGlobalTimer = undefined;
        }
        browserGlobalInitializedTime = 0;
    }
}
