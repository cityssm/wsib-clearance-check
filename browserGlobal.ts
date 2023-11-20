import type { Browser } from 'puppeteer'
import puppeteer from 'puppeteer'
import { clearIntervalAsync } from 'set-interval-async'
import { setIntervalAsync } from 'set-interval-async/dynamic'

/*
 * Headless Debug Setting
 */

let headless = true

export const setHeadless = (headlessStatus: boolean): void => {
  headless = headlessStatus
}

/*
 * Browser Global
 */

export const pageTimeoutMillis = 90_000
const browserStartupTimeoutMillis = 3 * 60_000

const browserGlobalExpiryMillis =
  Math.max(browserStartupTimeoutMillis, pageTimeoutMillis) + 10_000

let browserGlobal: Browser | undefined
let browserGlobalInitializedTime = 0
let browserGlobalTimer

function isBrowserGlobalReady(): boolean {
  return Boolean(
    browserGlobal !== undefined &&
      browserGlobalInitializedTime + browserGlobalExpiryMillis > Date.now()
  )
}

export async function getBrowserGlobal(): Promise<Browser> {
  if (!isBrowserGlobalReady()) {
    await cleanUpBrowserGlobal()

    keepBrowserGlobalAlive()

    browserGlobal = await puppeteer.launch({
      headless: headless ? 'new' : false,
      timeout: browserStartupTimeoutMillis,
      args: ['--lang-en-CA,en']
    })

    keepBrowserGlobalAlive()

    browserGlobalTimer = setIntervalAsync(
      cleanUpBrowserGlobal,
      browserGlobalExpiryMillis
    )
  }

  return browserGlobal as Browser
}

export function keepBrowserGlobalAlive(): void {
  browserGlobalInitializedTime = Date.now()
}

export async function cleanUpBrowserGlobal(useForce = false): Promise<void> {
  if (useForce) {
    browserGlobalInitializedTime = 0
  }

  if (!isBrowserGlobalReady()) {
    try {
      await browserGlobal.close()
    } catch {
      // ignore
    }

    browserGlobal = undefined

    if (browserGlobalTimer) {
      try {
        await clearIntervalAsync(browserGlobalTimer)
      } catch {
        // ignore
      }

      browserGlobalTimer = undefined
    }

    browserGlobalInitializedTime = 0
  }
}
