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

    function _sendData(data, type) {
        if (!serverURL || !appName || !clientInfo) {
            console.error(
                "ThothLogger :: No server, app, or client info provided. Run init() first."
            );
            return false;
        }

        var dataToPost = {
            app: appName,
            client: clientInfo,
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

    function log(data, passedType) {
        var type = passedType || "log";
        return _sendData(data, type);
    }

    function error(data) {
        return _sendData(data, "error");
    }

    return {
        init: init,
        log: log,
        error: error
    };
});
