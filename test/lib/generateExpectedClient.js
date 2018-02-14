/**
 * Generate an expected client object from a
 * a window.navigator object.
 *
 * The window.navigator object should be mocked.
 */
const generateExpectedClient = navigator => {
    var client = {};
    client.appCodeName = navigator.appCodeName || null;
    client.appName = navigator.appName || null;
    client.appVersion = navigator.appVersion || null;
    client.cookieEnabled = navigator.cookieEnabled || null;
    client.geolocation = navigator.geolocation || null;
    client.language = navigator.language || null;
    client.oscpu = navigator.oscpu || null;
    client.platform = navigator.platform || null;
    client.product = navigator.product || null;
    client.productSub = navigator.productSub || null;
    client.userAgent = navigator.userAgent || null;
    client.vendor = navigator.vendor || null;
    client.vendorSub = navigator.vendorSub || null;

    return client;
};

module.exports = generateExpectedClient;
