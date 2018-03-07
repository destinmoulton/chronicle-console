/**
 * Generate an expected client object from a
 * a window.navigator object.
 *
 * The window.navigator object should be mocked.
 */
const generateExpectedClient = navigator => {
    var client = {};
    client.appCodeName = navigator.appCodeName || null;
    client.appVersion = navigator.appVersion || null;
    client.cookieEnabled = navigator.cookieEnabled || null;
    client.language = navigator.language || null;
    client.oscpu = navigator.oscpu || null;
    client.platform = navigator.platform || null;
    client.product = navigator.product || null;
    client.productSub = navigator.productSub || null;
    client.vendor = navigator.vendor || null;
    client.vendorSub = navigator.vendorSub || null;

    client.appName = navigator.appName || null;
    client.userAgent = navigator.userAgent || null;

    client.brand = navigator.brand || null;
    client.buildNumber = navigator.buildNumber || null;
    client.bundleId = navigator.bundleId || null;
    client.deviceCountry = navigator.deviceCountry || null;
    client.deviceId = navigator.deviceId || null;
    client.deviceLocale = navigator.deviceLocale || null;
    client.deviceName = navigator.deviceName || null;
    client.manufacturer = navigator.manufacturer || null;
    client.model = navigator.model || null;
    client.systemName = navigator.systemName || null;
    client.systemVersion = navigator.systemVersion || null;
    client.timezone = navigator.timezone || null;
    client.uniqueId = navigator.uniqueId || null;
    client.version = navigator.version || null;
    client.isEmulator = navigator.isEmulator || null;
    client.isTablet = navigator.isTablet || null;

    return client;
};

module.exports = generateExpectedClient;
