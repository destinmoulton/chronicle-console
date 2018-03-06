(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.ChronicleConsole = factory());
}(this, (function () { 'use strict';

var Chronicle = (function () {
    function Chronicle(argHelpers, environmentParser, groupStack) {
        this._settings = {
            serverURL: "",
            appName: "",
            env: null,
            alsoConsole: true,
            globalize: true,
            methodsToLog: ["action", "error", "warn"],
            customMethods: []
        };
        this._console = console;
        this._timers = Object.create(null);
        console.log("ChronicleConsole :: constructor() RUNNING");
        if (typeof window !== "undefined") {
            this._global = window;
        }
        else if (typeof global !== "undefined") {
            this._global = global;
        }
        else {
            console.error("ChronicleConsole :: No global defined.");
        }
        this._argHelpers = argHelpers;
        this._environmentParser = environmentParser;
        this._groupStack = groupStack;
    }
    Chronicle.prototype.init = function (config) {
        this._settings.serverURL = config.server || "";
        this._settings.appName = config.app || "";
        this._settings.env = config.env || null;
        if ("toConsole" in config) {
            this._settings.alsoConsole = config.toConsole;
        }
        if ("globalize" in config) {
            this._settings.globalize = config.globalize;
        }
        this._settings.methodsToLog = config.methodsToLog || [
            "action",
            "error",
            "warn"
        ];
        this._settings.customMethods = config.customMethods || [];
        this._registerCustomMethods();
        this._console = config.consoleObject || console;
        if (this._settings.globalize) {
            this._overwriteGlobalConsole();
        }
        var navigatorIsAvailable = typeof this._global.navigator === "object";
        if (!this._settings.env && navigatorIsAvailable) {
            this._settings.env = this._global.navigator;
        }
        if (typeof this._global.fetch !== "undefined") {
            this._fetch = this._global.fetch.bind(this._global);
        }
        else {
            this._console.error("ChronicleConsole :: No fetch() method defined.");
        }
    };
    Chronicle.prototype._overwriteGlobalConsole = function () {
        if (typeof this._global.console !== "undefined") {
            this._global.console = this;
        }
    };
    Chronicle.prototype._registerCustomMethods = function () {
        var _this = this;
        this._settings.customMethods.forEach(function (method) {
            if (typeof _this[method] === "undefined") {
                _this[method] = function () {
                    var args = this._argHelpers.argumentsToArray(arguments);
                    if (args[0]) {
                        var data = this._argHelpers.collateArguments(args);
                        return this._logData(data, method);
                    }
                };
            }
        });
    };
    Chronicle.prototype._logIt = function (data, type) {
        if (!this._argHelpers.isArray(data) || data.length === 0) {
            return true;
        }
        if (data.length === 1) {
            data = data[0];
        }
        if (this._groupStack.isEmpty()) {
            return this._sendData(data, type);
        }
        this._groupStack.pushLog({ log: data, type: type });
    };
    Chronicle.prototype._sendData = function (data, type) {
        var _this = this;
        if (!this._settings.serverURL ||
            !this._settings.appName ||
            !this._settings.env) {
            this._console.error("ChronicleConsole :: No server, app, or client info provided. Run init() first.");
            return false;
        }
        var envInfo = this._environmentParser.collate(this._settings.env);
        var trace = this._stackTrace(4);
        var dataToPost = {
            app: this._settings.appName,
            client: envInfo,
            type: type,
            data: data,
            trace: trace
        };
        var params = {
            method: "post",
            body: JSON.stringify(dataToPost),
            headers: {
                "Content-Type": "text/plain"
            }
        };
        this._fetch(this._settings.serverURL, params).catch(function (err) {
            return _this._console.error(err);
        });
        return true;
    };
    Chronicle.prototype._shouldLog = function (methodName) {
        if (this._settings.methodsToLog === "all")
            return true;
        return this._settings.methodsToLog.indexOf(methodName) > -1
            ? true
            : false;
    };
    Chronicle.prototype._now = function () {
        if (typeof performance !== "undefined" &&
            performance.now !== undefined) {
            return performance.now();
        }
        else {
            return Date.now();
        }
    };
    Chronicle.prototype._stackTrace = function (depth) {
        var stackString = new Error().stack;
        var trace = stackString.split("\n").slice(depth, -1);
        return trace;
    };
    Chronicle.prototype.action = function () {
        if (!this._shouldLog("action"))
            return true;
        var args = this._argHelpers.argumentsToArray(arguments);
        if (args[0]) {
            var data = this._argHelpers.collateArguments(args);
            return this._logIt(data, "action");
        }
    };
    Chronicle.prototype.assert = function (assertion) {
        if (this._settings.alsoConsole)
            this._console.assert.apply(this, arguments);
        if (!this._shouldLog("assert"))
            return true;
        if (!assertion) {
            var args = this._argHelpers.argumentsToArray(arguments);
            return this._logIt(this._argHelpers.collateArguments(args.slice(1)), "assert");
        }
    };
    Chronicle.prototype.error = function () {
        if (this._settings.alsoConsole)
            this._console.error.apply(this, arguments);
        if (!this._shouldLog("error"))
            return true;
        var args = this._argHelpers.argumentsToArray(arguments);
        if (args[0]) {
            var data = this._argHelpers.collateArguments(args);
            return this._logIt(data, "error");
        }
    };
    Chronicle.prototype.group = function () {
        if (this._settings.alsoConsole)
            this._console.group.apply(this, arguments);
        if (!this._shouldLog("group"))
            return true;
        this._groupStack.addGroup();
    };
    Chronicle.prototype.groupCollapsed = function () {
        if (this._settings.alsoConsole)
            this._console.groupCollapsed.apply(this, arguments);
        if (!this._shouldLog("groupCollapsed"))
            return true;
        this._groupStack.addGroup();
    };
    Chronicle.prototype.groupEnd = function () {
        if (this._settings.alsoConsole)
            this._console.groupEnd.apply(this, arguments);
        if (!this._shouldLog("group") && !this._shouldLog("groupCollapsed"))
            return true;
        var head = this._groupStack.removeGroup();
        if (!this._groupStack.isEmpty()) {
            this._groupStack.pushLog({ type: "group", log: head });
        }
        else {
            return this._logIt([{ type: "group", log: head }], "group");
        }
    };
    Chronicle.prototype.info = function () {
        if (this._settings.alsoConsole)
            this._console.info.apply(this, arguments);
        if (!this._shouldLog("info"))
            return true;
        var args = this._argHelpers.argumentsToArray(arguments);
        if (args[0]) {
            var data = this._argHelpers.collateArguments(args);
            return this._logIt(data, "info");
        }
    };
    Chronicle.prototype.log = function () {
        if (this._settings.alsoConsole)
            this._console.log.apply(this, arguments);
        if (!this._shouldLog("log"))
            return true;
        var args = this._argHelpers.argumentsToArray(arguments);
        if (args[0]) {
            var data = this._argHelpers.collateArguments(args);
            return this._logIt(data, "log");
        }
    };
    Chronicle.prototype.table = function () {
        if (this._settings.alsoConsole)
            this._console.table.apply(this, arguments);
        if (!this._shouldLog("table"))
            return true;
        var args = this._argHelpers.argumentsToArray(arguments);
        if (args[0]) {
            var data = this._argHelpers.collateArguments(args);
            return this._logIt(data, "table");
        }
    };
    Chronicle.prototype.time = function (label) {
        if (this._settings.alsoConsole)
            this._console.time(label);
        if (!this._shouldLog("time"))
            return true;
        var timerLabel = label === undefined ? "default" : "" + label;
        this._timers[timerLabel] = this._now();
    };
    Chronicle.prototype.timeEnd = function (label) {
        if (this._settings.alsoConsole)
            this._console.timeEnd(label);
        if (!this._shouldLog("time"))
            return true;
        var timerLabel = label === undefined ? "default" : "" + label;
        if (this._timers[timerLabel] !== undefined) {
            var elapsed = (this._now() - this._timers[timerLabel]).toFixed(2);
            var data = [timerLabel + ": " + elapsed + "ms"];
            delete this._timers[timerLabel];
            return this._logIt(data, "time");
        }
    };
    Chronicle.prototype.trace = function () {
        if (this._settings.alsoConsole)
            this._console.trace.apply(this, arguments);
        if (!this._shouldLog("trace"))
            return true;
        var args = this._argHelpers.argumentsToArray(arguments);
        var data = [];
        if (args[0]) {
            data = this._argHelpers.collateArguments(args);
        }
        data.push(this._stackTrace(2));
        return this._logIt(data, "trace");
    };
    Chronicle.prototype.warn = function () {
        if (this._settings.alsoConsole)
            this._console.warn.apply(this, arguments);
        if (!this._shouldLog("warn"))
            return true;
        var args = this._argHelpers.argumentsToArray(arguments);
        if (args[0]) {
            var data = this._argHelpers.collateArguments(args);
            return this._logIt(data, "warn");
        }
    };
    Chronicle.prototype.clear = function () {
        if (this._settings.alsoConsole)
            this._console.clear();
    };
    Chronicle.prototype.count = function () {
        if (this._settings.alsoConsole)
            this._console.count.apply(this, arguments);
    };
    Chronicle.prototype.dir = function () {
        if (this._settings.alsoConsole && this._console.dir !== undefined)
            this._console.dir.apply(this, arguments);
    };
    Chronicle.prototype.dirxml = function () {
        if (this._settings.alsoConsole && this._console.dirxml !== undefined)
            this._console.dirxml.apply(this, arguments);
    };
    Chronicle.prototype.profile = function () {
        if (this._settings.alsoConsole && this._console.profile !== undefined)
            this._console.profile.apply(this, arguments);
    };
    Chronicle.prototype.profileEnd = function () {
        if (this._settings.alsoConsole &&
            this._console.profileEnd !== undefined)
            this._console.profileEnd.apply(this, arguments);
    };
    return Chronicle;
}());

var ArgHelpers = (function () {
    function ArgHelpers() {
    }
    ArgHelpers.prototype.isArray = function (obj) {
        return Object.prototype.toString.call(obj) === "[object Array]";
    };
    ArgHelpers.prototype.isObject = function (obj) {
        return obj !== null && typeof obj === "object";
    };
    ArgHelpers.prototype.isObjectEmpty = function (obj) {
        var hasOwnProperty = Object.prototype.hasOwnProperty;
        for (var key in obj) {
            if (hasOwnProperty.call(obj, key))
                return false;
        }
        return true;
    };
    ArgHelpers.prototype.isString = function (obj) {
        return typeof obj === "string" || obj instanceof String;
    };
    ArgHelpers.prototype.isArgDefined = function (obj) {
        return obj !== undefined && obj !== null;
    };
    ArgHelpers.prototype.isArgEmpty = function (arg) {
        if (this.isArray(arg)) {
            return arg.length === 0;
        }
        else if (this.isObject(arg)) {
            return this.isObjectEmpty(arg);
        }
        else if (this.isString(arg)) {
            return arg.length === 0;
        }
        return false;
    };
    ArgHelpers.prototype.collateArguments = function (args) {
        var data = [];
        for (var i = 0; i < args.length; i++) {
            var arg = args[i];
            if (this.isArgDefined(arg) && !this.isArgEmpty(arg)) {
                data.push(JSON.parse(JSON.stringify(arg)));
            }
        }
        return data;
    };
    ArgHelpers.prototype.argumentsToArray = function (args) {
        return Array.prototype.slice.call(args);
    };
    return ArgHelpers;
}());
//# sourceMappingURL=ArgHelpers.js.map

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

var __assign = Object.assign || function __assign(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
};

var EnvironmentParser = (function () {
    function EnvironmentParser() {
    }
    EnvironmentParser.prototype.collate = function (info) {
        return __assign({}, this._browserInfo(info), this._sharedInfo(info), this._reactNativeInfo(info));
    };
    EnvironmentParser.prototype._browserInfo = function (info) {
        var env = {};
        env.appCodeName = info.appCodeName || null;
        env.appVersion = info.appVersion || null;
        env.cookieEnabled = info.cookieEnabled || null;
        env.language = info.language || null;
        env.oscpu = info.oscpu || null;
        env.platform = info.platform || null;
        env.product = info.product || null;
        env.productSub = info.productSub || null;
        env.vendor = info.vendor || null;
        env.vendorSub = info.vendorSub || null;
        return env;
    };
    EnvironmentParser.prototype._sharedInfo = function (info) {
        var env = {};
        env.appName = info.appName || null;
        env.userAgent = info.userAgent || null;
        return env;
    };
    EnvironmentParser.prototype._reactNativeInfo = function (info) {
        var env = {};
        env.brand = info.brand || null;
        env.buildNumber = info.buildNumber || null;
        env.bundleId = info.bundleId || null;
        env.deviceCountry = info.deviceCountry || null;
        env.deviceId = info.deviceId || null;
        env.deviceLocale = info.deviceLocale || null;
        env.deviceName = info.deviceName || null;
        env.manufacturer = info.manufacturer || null;
        env.model = info.model || null;
        env.systemName = info.systemName || null;
        env.systemVersion = info.systemVersion || null;
        env.timezone = info.timezone || null;
        env.uniqueId = info.uniqueId || null;
        env.version = info.version || null;
        env.isEmulator = info.isEmulator || null;
        env.isTablet = info.isTablet || null;
        return env;
    };
    return EnvironmentParser;
}());
//# sourceMappingURL=EnvironmentParser.js.map

var GroupStack = (function () {
    function GroupStack() {
        this._stack = [];
    }
    GroupStack.prototype.addGroup = function () {
        this._stack.unshift([]);
    };
    GroupStack.prototype.removeGroup = function () {
        return this._stack.shift();
    };
    GroupStack.prototype.pushLog = function (logItem) {
        this._stack[0].push(logItem);
    };
    GroupStack.prototype.isEmpty = function () {
        return this._stack.length === 0;
    };
    return GroupStack;
}());
//# sourceMappingURL=GroupStack.js.map

var argHelpers = new ArgHelpers();
var environmentParser = new EnvironmentParser();
var groupStack = new GroupStack();
var index = new Chronicle(argHelpers, environmentParser, groupStack);
//# sourceMappingURL=index.js.map

return index;

})));
