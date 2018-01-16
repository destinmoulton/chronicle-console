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
    var alsoConsole = false;
    var _timers = Object.create(null);
    var _groupStack = [];

    function init(config, app, client, toConsole) {
        if (
            typeof config === "string" &&
            typeof app === "string" &&
            typeof clientInfo === "object" &&
            typeof toConsole === "boolean"
        ) {
            serverURL = config;
            appName = app;
            clientInfo = client;
            alsoConsole = toConsole;
        } else if (typeof config === "object") {
            serverURL = config.server || "";
            app = config.app || "";
            clientInfo = config.client || null;
            alsoConsole = config.toConsole || false;
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

    function _logData(data, type) {
        if (_groupStack.length === 0) {
            return _sendData(data, type);
        }

        // The zeroth element (head) holds the current group
        _groupStack[0].push({
            log: data,
            type: type
        });
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

    function _now() {
        if (performance.now !== undefined) {
            return performance.now();
        } else {
            return Date.now();
        }
    }

    // From https://stackoverflow.com/a/635852/470577
    function _stackTrace() {
        var err = new Error();
        var stackString = err.stack;
        // Remove the trace lines for this and trace() call
        return stackString.split("\n").slice(2, -1);
    }

    function assert(assertion) {
        if (alsoConsole) console.assert.apply(this, arguments);

        if (!assertion) {
            var args = _argumentsToArray(arguments);
            return _logData(_collateArguments(args.slice(1)), "assert");
        }
    }

    function error() {
        if (alsoConsole) console.error.apply(this, arguments);

        var args = _argumentsToArray(arguments);
        if (args[0]) {
            var data = _collateArguments(args);
            return _logData(data, "error");
        }
    }

    function group() {
        if (alsoConsole) console.group.apply(this, arguments);

        // Add an array to the stack
        _groupStack.unshift([]);
    }

    function groupEnd() {
        if (alsoConsole) console.groupEnd.apply(this, arguments);

        var head = _groupStack.shift();
        if (_groupStack.length > 0) {
            // Put the finished group into the still active group
            _groupStack[0].push(head);
        } else {
            _logData(head, "group");
        }
    }

    function info() {
        if (alsoConsole) console.info.apply(this, arguments);

        var args = _argumentsToArray(arguments);
        if (args[0]) {
            var data = _collateArguments(args);
            return _logData(data, "info");
        }
    }

    function log() {
        if (alsoConsole) console.log.apply(this, arguments);

        var args = _argumentsToArray(arguments);
        if (args[0]) {
            var data = _collateArguments(args);
            return _logData(data, "log");
        }
    }

    function table() {
        if (alsoConsole) console.table.apply(this, arguments);

        log.apply(this, arguments);
    }

    function time(label) {
        if (alsoConsole) console.time(label);

        if (typeof label === "string") {
            _timers[label] = _now();
        }
    }

    function timeEnd(label) {
        if (alsoConsole) console.timeEnd(label);

        if (typeof label === "string" && _timers[label] !== undefined) {
            var elapsed = (_now() - _timers[label]).toFixed(2);
            var data = `${label}: ${elapsed}ms`;
            delete _timers[label];
            return _logData(data, "time");
        }
    }

    function trace() {
        if (alsoConsole) console.trace.apply(this, arguments);

        var args = _argumentsToArray(arguments);
        if (args[0]) {
            var data = _collateArguments(args);
            data.push(_stackTrace());
            return _logData(data, "trace");
        }
    }

    function warn() {
        if (alsoConsole) console.warn.apply(this, arguments);

        var args = _argumentsToArray(arguments);
        if (args[0]) {
            var data = _collateArguments(args);
            return _logData(data, "warn");
        }
    }

    return {
        init: init,
        assert: assert,
        error: error,
        group: group,
        groupEnd: groupEnd,
        info: info,
        log: log,
        table: table,
        time: time,
        timeEnd: timeEnd,
        trace: trace,
        warn: warn
    };
});
