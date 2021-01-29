"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClearanceByAccountNumber = void 0;
const puppeteer = require("puppeteer");
const config = require("./config");
const getClearanceByAccountNumber = (accountNumber) => __awaiter(void 0, void 0, void 0, function* () {
    const promise = new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        const browser = yield puppeteer.launch();
        const page = yield browser.newPage();
        console.log("goto start");
        page.goto(config.clearanceURL)
            .catch((e) => {
            reject("goto error");
        });
        console.log("goto done");
        yield page.waitForSelector("body");
        yield page.$eval("body", (bodyEle) => {
            console.log("body ready");
            console.log(bodyEle.outerHTML);
        });
        yield page.$eval("#search-box--searchtext", (inputEle) => {
            inputEle.value = "1302396";
            console.log("submit start");
            inputEle.closest("form").submit();
            console.log("submit end");
        });
        yield browser.close();
        resolve(1);
    }));
    return promise;
});
exports.getClearanceByAccountNumber = getClearanceByAccountNumber;
