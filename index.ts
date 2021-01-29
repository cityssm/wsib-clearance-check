import * as puppeteer from "puppeteer";

import * as config from "./config";


export const getClearanceByAccountNumber = async (accountNumber: string): Promise<{}> => {

  const promise = new Promise(async (resolve, reject) => {

      const browser: puppeteer.Browser = await puppeteer.launch();

      const page = await browser.newPage();

      console.log("goto start");
      page.goto(config.clearanceURL)
        .catch((e) => {
          reject("goto error");
        });
      console.log("goto done");

      await page.waitForSelector("body");

      await page.$eval("body", (bodyEle: HTMLBodyElement) => {
        console.log("body ready");
        console.log(bodyEle.outerHTML);
      });

      await page.$eval("#search-box--searchtext", (inputEle: HTMLInputElement) => {
        inputEle.value = "1302396";

        console.log("submit start");
        inputEle.closest("form").submit();
        console.log("submit end");
      });

      await browser.close();

      resolve(1);

    });

  return promise;

};
