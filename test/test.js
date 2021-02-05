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
const assert = require("assert");
const wsib = require("../index");
describe("getClearanceByAccountNumber", () => __awaiter(void 0, void 0, void 0, function* () {
    it("Returns { success: true } on a valid WSIB account number", () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const result = yield wsib.getClearanceByAccountNumber("9001832");
            console.log(result);
            assert.strictEqual(result.success, true);
        }
        catch (e) {
            assert.fail(e);
        }
    }));
    it("Returns { success: false } on an invalid WSIB account number", () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const result = yield wsib.getClearanceByAccountNumber("1");
            console.log(result);
            assert.strictEqual(result.success, false);
        }
        catch (e) {
            assert.fail(e);
        }
    }));
}));
