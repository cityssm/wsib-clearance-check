import type { Browser } from "puppeteer";
export declare const setHeadless: (headlessStatus: boolean) => void;
export declare const pageTimeoutMillis = 90000;
export declare function getBrowserGlobal(): Promise<Browser>;
export declare function keepBrowserGlobalAlive(): void;
export declare function cleanUpBrowserGlobal(useForce?: boolean): Promise<void>;
