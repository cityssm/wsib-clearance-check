import puppeteerLaunch from '@cityssm/puppeteer-launch'
import exitHook from 'exit-hook'
import type { Browser } from 'puppeteer'
import {
  type SetIntervalAsyncTimer,
  clearIntervalAsync,
  setIntervalAsync
} from 'set-interval-async/dynamic'

/*
 * Browser Global
 */

export const pageTimeoutMillis = 90_000
const browserStartupTimeoutMillis = 3 * 60_000

const browserGlobalExpiryMillis =
  Math.max(browserStartupTimeoutMillis, pageTimeoutMillis) + 10_000

let browserGlobal: Browser | undefined
let browserGlobalInitializedTime = 0
let browserGlobalTimer: SetIntervalAsyncTimer<unknown[]> | undefined

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

    browserGlobal = await puppeteerLaunch()

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
      await browserGlobal?.close()
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

exitHook(() => {
  void cleanUpBrowserGlobal(true)
})
