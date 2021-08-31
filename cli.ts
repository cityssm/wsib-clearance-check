import { getClearanceByAccountNumber } from "./index.js";

const cli = async () => {
  const accountNumbers = process.argv[2].split(",");

  for (const accountNumber of accountNumbers) {
    const results = await getClearanceByAccountNumber(accountNumber);
    console.log(results);
  }
};

cli();
