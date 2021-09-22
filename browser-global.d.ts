import puppeteer from "puppeteer";
export declare const setHeadless: (headlessStatus: boolean) => void;
export declare const pageTimeoutMillis = 90000;
export declare const initializeBrowserGlobal: () => Promise<puppeteer.Browser>;
export declare const cleanUpBrowserGlobal: (useForce?: boolean) => Promise<void>;
