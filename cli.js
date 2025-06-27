import { cleanUpBrowser, getClearanceByAccountNumber } from './index.js';
async function cli() {
    const accountNumbers = process.argv[2].split(',');
    for (const accountNumber of accountNumbers) {
        const results = await getClearanceByAccountNumber(accountNumber);
        // eslint-disable-next-line no-console
        console.log(results);
    }
    await cleanUpBrowser();
}
await cli();
