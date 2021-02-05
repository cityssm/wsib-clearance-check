import * as assert from "assert";
import * as wsib from "../index";


// eslint-disable-next-line @typescript-eslint/no-misused-promises
describe("getClearanceByAccountNumber", async () => {

  it("Returns { success: true } on a valid WSIB account number", async () => {

    try {
      const result = await wsib.getClearanceByAccountNumber("9001832");
      console.log(result);
      assert.strictEqual(result.success, true);

    } catch (e) {
      assert.fail(e);
    }
  });

  it("Returns { success: false } on an invalid WSIB account number", async () => {

    try {
      const result = await wsib.getClearanceByAccountNumber("1");
      console.log(result);
      assert.strictEqual(result.success, false);

    } catch (e) {
      assert.fail(e);
    }
  });
});
