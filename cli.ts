import { cleanUpBrowser, getClearanceByAccountNumber } from './index.js'

async function cli(): Promise<void> {
  const accountNumbers = process.argv[2].split(',')

  for (const accountNumber of accountNumbers) {
    const results = await getClearanceByAccountNumber(accountNumber)
    console.log(results)
  }

  await cleanUpBrowser()
}

await cli()
