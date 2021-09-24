import puppeteer from "puppeteer";
export declare const setHeadless: (headlessStatus: boolean) => void;
export declare const pageTimeoutMillis = 90000;
export declare const getBrowserGlobal: () => Promise<puppeteer.Browser>;
export declare const keepBrowserGlobalAlive: () => void;
export declare const cleanUpBrowserGlobal: (useForce?: boolean) => Promise<void>;
