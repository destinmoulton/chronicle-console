/**
 * Generate an expected client object from a
 * a window.navigator object.
 *
 * The window.navigator object should be mocked.
 */
const generateExpectedClient = navigator => {
    var client = {};
    client.appCodeName = navigator.appCodeName || "";
    client.appName = navigator.appName || "";
    client.appVersion = navigator.appVersion || "";
    client.cookieEnabled = navigator.cookieEnabled || "";
    client.geolocation = navigator.geolocation || "";
    client.language = navigator.language || "";
    client.oscpu = navigator.oscpu || "";
    client.platform = navigator.platform || "";
    client.product = navigator.product || "";
    client.productSub = navigator.productSub || "";
    client.userAgent = navigator.userAgent || "";
    client.vendor = navigator.vendor || "";
    client.vendorSub = navigator.vendorSub || "";

    return client;
};

module.exports = generateExpectedClient;
