import { DEBUG_ENABLE_NAMESPACES as DEBUG_ENABLE_NAMESPACES_PUPPETEER_LAUNCH } from '@cityssm/puppeteer-launch/debug';
/**
 * The debug namespace for this package.
 */
export const DEBUG_NAMESPACE = 'wsib-clearance-check';
/**
 * The debug namespaces string to enable debug output for this package.
 */
export const DEBUG_ENABLE_NAMESPACES = [
    `${DEBUG_NAMESPACE}:*`,
    DEBUG_ENABLE_NAMESPACES_PUPPETEER_LAUNCH
].join(',');
