import assert from "assert";
import * as wsib from "../index.js";
import { getWSIBClassificationFromNAICSCode } from "../wsib-classifications.js";


// eslint-disable-next-line @typescript-eslint/no-misused-promises
describe("getClearanceByAccountNumber", async () => {

  wsib.setHeadless(false);

  it("Returns { success: true } on a valid WSIB account number", async () => {

    try {
      const result = await wsib.getClearanceByAccountNumber("9001832");
      console.log(result);
      assert.strictEqual(result.success, true);

    } catch (error) {
      assert.fail(error);
    }
  });

  it("Returns { success: false } on an invalid WSIB account number", async () => {

    try {
      const result = await wsib.getClearanceByAccountNumber("1");
      console.log(result);
      assert.strictEqual(result.success, false);

    } catch (error) {
      assert.fail(error);
    }
  });
});


describe("getWSIBClassificationFromNAICSCode", () => {

  it("Returns { subclassName: 'Hospitals' } on naicsCode = '622000'", async () => {

    try {
      const result = getWSIBClassificationFromNAICSCode("622000");
      assert.strictEqual(result.subclassName, "Hospitals");

    } catch (error) {
      assert.fail(error);
    }
  });
});
