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

    var _options = {
        serverURL: "",
        appName: "",
        clientInfo: null,
        alsoConsole: false,
        alsoConsoleNonStandard: false
    };

    var _console = global.console;

    var _timers = Object.create(null);
    var _groupStack = [];

    function init(config) {
        _options.serverURL = config.server || "";
        _options.appName = config.app || "";
        _options.clientInfo = config.clientInfo || null;
        _options.alsoConsole = config.toConsole || false;
        _options.alsoConsoleNonStandard = config.nonStandardConsole || false;

        if (config.overwriteGlobalConsole) {
            _overwriteGlobalConsole();
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
        if (data.length && data.length === 1) {
            // Don't log an array if there is only one
            // piece of data
            data = data[0];
        }

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
        if (!_options.serverURL || !_options.appName || !_options.clientInfo) {
            _console.error(
                "ThothLogger :: No server, app, or client info provided. Run init() first."
            );
            return false;
        }

        var cleanClientInfo = {};
        if (_options.clientInfo.userAgent) {
            cleanClientInfo = _collateBrowserInfo(_options.clientInfo);
        }

        var dataToPost = {
            app: _options.appName,
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
        fetch(_options.serverURL, params);
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

    function _addGroupToStack() {
        // Add an array to the stack
        _groupStack.unshift([]);
    }

    function assert(assertion) {
        if (_options.alsoConsole) _console.assert.apply(this, arguments);

        if (!assertion) {
            var args = _argumentsToArray(arguments);
            return _logData(_collateArguments(args.slice(1)), "assert");
        }
    }

    function error() {
        if (_options.alsoConsole) _console.error.apply(this, arguments);

        var args = _argumentsToArray(arguments);
        if (args[0]) {
            var data = _collateArguments(args);
            return _logData(data, "error");
        }
    }

    function group() {
        if (_options.alsoConsole) _console.group.apply(this, arguments);

        _addGroupToStack();
    }

    function groupCollapsed() {
        if (_options.alsoConsole)
            _console.groupCollapsed.apply(this, arguments);

        _addGroupToStack();
    }

    function groupEnd() {
        if (_options.alsoConsole) _console.groupEnd.apply(this, arguments);

        var head = _groupStack.shift();
        if (_groupStack.length > 0) {
            // Put the finished group into the still active group
            _groupStack[0].push(head);
        } else {
            _logData(head, "group");
        }
    }

    function info() {
        if (_options.alsoConsole) _console.info.apply(this, arguments);

        var args = _argumentsToArray(arguments);
        if (args[0]) {
            var data = _collateArguments(args);
            return _logData(data, "info");
        }
    }

    function log() {
        if (_options.alsoConsole) _console.log.apply(this, arguments);

        var args = _argumentsToArray(arguments);
        if (args[0]) {
            var data = _collateArguments(args);
            return _logData(data, "log");
        }
    }

    function table() {
        if (_options.alsoConsole) _console.table.apply(this, arguments);

        log.apply(this, arguments);
    }

    function time(label) {
        if (_options.alsoConsole) _console.time(label);

        if (typeof label === "string") {
            _timers[label] = _now();
        }
    }

    function timeEnd(label) {
        if (_options.alsoConsole) _console.timeEnd(label);

        if (typeof label === "string" && _timers[label] !== undefined) {
            var elapsed = (_now() - _timers[label]).toFixed(2);
            var data = `${label}: ${elapsed}ms`;
            delete _timers[label];
            return _logData(data, "time");
        }
    }

    function trace() {
        if (_options.alsoConsole) _console.trace.apply(this, arguments);

        var args = _argumentsToArray(arguments);
        if (args[0]) {
            var data = _collateArguments(args);
            data.push(_stackTrace());
            return _logData(data, "trace");
        }
    }

    function warn() {
        if (_options.alsoConsole) _console.warn.apply(this, arguments);

        var args = _argumentsToArray(arguments);
        if (args[0]) {
            var data = _collateArguments(args);
            return _logData(data, "warn");
        }
    }

    /**
     * Stubs for console functions that aren't logged
     */
    function clear() {
        if (_options.alsoConsole) _console.clear();
    }

    function count() {
        if (_options.alsoConsole) _console.count.apply(this, arguments);
    }

    /**
     * Stubs for Non-Standard console functions
     */
    function dir() {
        if (_options.alsoConsoleNonStandard)
            _console.dir.apply(this, arguments);
    }

    function dirxml() {
        if (_options.alsoConsoleNonStandard)
            _console.dirxml.apply(this, arguments);
    }

    function profile() {
        if (_options.alsoConsoleNonStandard)
            _console.profile.apply(this, arguments);
    }

    function profileEnd() {
        if (_options.alsoConsoleNonStandard)
            _console.profileEnd.apply(this, arguments);
    }

    function timeStamp() {
        if (_options.alsoConsoleNonStandard)
            _console.timeStamp.apply(this, arguments);
    }

    var publicMethods = {
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
        warn: warn,

        // Non-logged or non-standard
        clear: clear,
        count: count,
        dir: dir,
        dirxml: dirxml,
        profile: profile,
        profileEnd: profileEnd,
        timeStamp: timeStamp
    };

    function _overwriteGlobalConsole() {
        global.console = publicMethods;
    }

    return publicMethods;
});
