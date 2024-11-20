import puppeteerLaunch from '@cityssm/puppeteer-launch';
import exitHook from 'exit-hook';
import { clearIntervalAsync, setIntervalAsync } from 'set-interval-async/dynamic';
/*
 * Browser Global
 */
export const pageTimeoutMillis = 90_000;
const browserStartupTimeoutMillis = 3 * 60_000;
const browserGlobalExpiryMillis = Math.max(browserStartupTimeoutMillis, pageTimeoutMillis) + 10_000;
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
        browserGlobal = await puppeteerLaunch();
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
            await browserGlobal?.close();
        }
        catch {
            // ignore
        }
        browserGlobal = undefined;
        if (browserGlobalTimer) {
            try {
                await clearIntervalAsync(browserGlobalTimer);
            }
            catch {
                // ignore
            }
            browserGlobalTimer = undefined;
        }
        browserGlobalInitializedTime = 0;
    }
}
exitHook(() => {
    void cleanUpBrowserGlobal(true);
});
