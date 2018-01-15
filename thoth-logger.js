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

    function init(config, app) {
        if (typeof config === "string" && typeof app === "string") {
            serverURL = config;
            appName = app;
        } else if (typeof config === "object") {
            serverURL = config.server || "";
            app = config.app || "";
        }
    }

    function log(data, passedType) {
        var type = passedType || "log";
        if (!serverURL || !appName) {
            console.error(
                "ThothLogger :: No server or app name provided. Run init() first."
            );
            return false;
        }

        var dataToPost = {
            app: appName,
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

    // Return the functions that you want to be publicly accessible
    return {
        init: init,
        log: log
    };
});
