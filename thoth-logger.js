/**
 * ThothLogger
 */
(function(global, appName, app) {
    // define() the module using AMD/RequireJS
    if (typeof define === "function" && typeof define.amd === "object") {
        define(app);
    } else if (typeof module !== "undefined") {
        // Export as a node or CommonJS module
        module.exports = app(global);
    } else {
        // Add the app to the global browser namespace
        global[appName] = app(global);
    }
})(this, "ThothLogger", function(global) {
    "use strict";

    var serverURL = "";
    var appName = "";
    var clientInfo = null;

    function init(config, app, client) {
        if (
            typeof config === "string" &&
            typeof app === "string" &&
            typeof clientInfo === "object"
        ) {
            serverURL = config;
            appName = app;
            clientInfo = client;
        } else if (typeof config === "object") {
            serverURL = config.server || "";
            app = config.app || "";
            clientInfo = config.client || null;
        }
    }

    function _collateBrowserInfo(info) {
        var browserInfo = {};
        browserInfo.appCodeName = info.appCodeName || "";
        browserInfo.appName = info.appName || "";
        browserInfo.appVersion = info.appVersion || "";
        browserInfo.cookieEnabled = info.cookieEnabled || "";
        browserInfo.geolocation = info.geolocation || "";
        browserInfo.language = info.language || "";
        browserInfo.platform = info.platform || "";
        browserInfo.product = info.product || "";
        browserInfo.userAgent = info.userAgent || "";
        browserInfo.oscpu = info.oscpu || "";
        return browserInfo;
    }

    function _sendData(data, type) {
        if (!serverURL || !appName || !clientInfo) {
            console.error(
                "ThothLogger :: No server, app, or client info provided. Run init() first."
            );
            return false;
        }

        var cleanClientInfo = {};
        if (clientInfo.userAgent) {
            cleanClientInfo = _collateBrowserInfo(clientInfo);
        }

        if (data.length && data.length === 1) {
            // Don't send an array if there is only one
            // piece of data
            data = data[0];
        }

        var dataToPost = {
            app: appName,
            client: cleanClientInfo,
            type: type,
            info: data
        };

        var params = {
            method: "post",
            body: JSON.stringify(dataToPost),
            headers: {
                "Content-Type": "text/plain"
            }
        };
        fetch(serverURL, params);
        return true;
    }

    function _collateArguments(args) {
        var data = [];
        for (var i = 0; i < args.length; i++) {
            data.push(JSON.parse(JSON.stringify(args[i])));
        }
        return data;
    }

    function _argumentsToArray(args) {
        return Array.prototype.slice.call(args);
    }

    function assert(assertion) {
        if (!assertion) {
            var args = _argumentsToArray(arguments);
            return _sendData(_collateArguments(args.slice(1)), "assert");
        }
    }

    function log() {
        var args = _argumentsToArray(arguments);
        if (args[0]) {
            var data = _collateArguments(args);
            return _sendData(data, "log");
        }
    }

    function error() {
        var args = _argumentsToArray(arguments);
        if (args[0]) {
            var data = _collateArguments(args);
            return _sendData(data, "error");
        }
    }

    return {
        init: init,
        assert: assert,
        log: log,
        error: error
    };
});
