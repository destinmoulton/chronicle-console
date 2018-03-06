/**
 * Console methods.
 */

import GroupStack from "./GroupStack";
import Helpers from "./Helpers";
import * as Types from "./types";
import Environment from "./Environment";

export default class ChronicleConsole {
    private _settings: Types.ISettings = {
        serverURL: "",
        appName: "",
        env: null,
        alsoConsole: true,
        globalize: true,
        methodsToLog: ["action", "error", "warn"],
        customMethods: []
    };

    private _helpers: Helpers;

    private _console = console;
    private _fetch: any;
    private _timers = Object.create(null);

    constructor(argHelpers) {
        this._helpers = argHelpers;
    }

    init(config) {
        this._settings.serverURL = config.server || "";
        this._settings.appName = config.app || "";
        this._settings.env = config.env || null; // The users environment info
        this._settings.alsoConsole = config.toConsole || true; // Log to the console?
        this._settings.globalize = config.globalize || true; // Overwrite the global/window console

        // The methods that should be logged to the server
        this._settings.methodsToLog = config.methodsToLog || [
            "action",
            "error",
            "warn"
        ];

        // Custom logging methods
        this._settings.customMethods = config.customMethods || [];
        this._registerCustomMethods();

        // Setup the global console
        this._console = config.consoleObject || console;
        if (this._settings.globalize) {
            this._overwriteGlobalConsole();
        }

        var windowIsAvailable =
            typeof window !== "undefined" &&
            typeof window.navigator === "object";

        if (!this._settings.env && windowIsAvailable) {
            // Set the default to window navigator if available
            this._settings.env = window.navigator;
        }

        if (typeof fetch !== "undefined") {
            // Define the local fetch method
            this._fetch = fetch;
        } else {
            this._console.error(
                "ChronicleConsole :: No fetch() method defined."
            );
        }
    }

    private _overwriteGlobalConsole() {
        if (typeof console !== "undefined") {
            (<any>console) = this;
        }
    }

    private _registerCustomMethods() {
        this._settings.customMethods.forEach(method => {
            if (typeof this[method] === "undefined") {
                this[method] = function() {
                    var args = this._helpers.argumentsToArray(arguments);
                    if (args[0]) {
                        var data = this._helpers.collateArguments(args);
                        return this._logData(data, method);
                    }
                };
            }
        });
    }

    private _logIt(data, type) {
        this._console.log("_logIt called");
        if (this._helpers.isArray(data) || data.length === 0) {
            // Only allow arrays
            return true;
        }

        this._console.log("_logIt between");
        if (data.length === 1) {
            // Don't log an array if there is only one
            // piece of data
            data = data[0];
        }
        this._console.log("_logIt right before groupstack check");
        if (GroupStack.isEmpty()) {
            return this._sendData(data, type);
        }

        // The zeroth element (head) holds the current group
        GroupStack.pushLog({ log: data, type });
    }

    private _sendData(data, type) {
        this._console.log("_sendData called");
        if (
            !this._settings.serverURL ||
            !this._settings.appName ||
            !this._settings.env
        ) {
            this._console.error(
                "ChronicleConsole :: No server, app, or client info provided. Run init() first."
            );
            return false;
        }

        var envInfo = Environment.collate(this._settings.env);

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

        this._fetch(this._settings.serverURL, params);

        return true;
    }

    private _shouldLog(methodName: string) {
        if (this._settings.methodsToLog === "all") return true;

        return this._settings.methodsToLog.indexOf(methodName) > -1
            ? true
            : false;
    }

    private _now() {
        if (
            typeof performance !== "undefined" &&
            performance.now !== undefined
        ) {
            return performance.now();
        } else {
            return Date.now();
        }
    }

    // From https://stackoverflow.com/a/635852/470577
    private _stackTrace(depth) {
        var stackString = new Error().stack;
        // Remove the trace lines for this and trace() call
        // from depth to -1 (the split adds an extra empty element)
        var trace = stackString.split("\n").slice(depth, -1);
        return trace;
    }

    /**
     * This is a method not provided by the
     * standard/global console. This method is
     * used for logging user actions.
     */
    action() {
        if (!this._shouldLog("action")) return true;

        var args = this._helpers.argumentsToArray(arguments);
        if (args[0]) {
            var data = this._helpers.collateArguments(args);
            return this._logIt(data, "action");
        }
    }

    assert(assertion) {
        if (this._settings.alsoConsole)
            this._console.assert.apply(this, arguments);

        if (!this._shouldLog("assert")) return true;

        if (!assertion) {
            var args = this._helpers.argumentsToArray(arguments);
            return this._logIt(
                this._helpers.collateArguments(args.slice(1)),
                "assert"
            );
        }
    }

    error() {
        if (this._settings.alsoConsole)
            this._console.error.apply(this, arguments);

        if (!this._shouldLog("error")) return true;

        var args = this._helpers.argumentsToArray(arguments);
        if (args[0]) {
            var data = this._helpers.collateArguments(args);
            return this._logIt(data, "error");
        }
    }

    group() {
        if (this._settings.alsoConsole)
            this._console.group.apply(this, arguments);

        if (!this._shouldLog("group")) return true;

        GroupStack.addGroup();
    }

    groupCollapsed() {
        if (this._settings.alsoConsole)
            this._console.groupCollapsed.apply(this, arguments);

        if (!this._shouldLog("groupCollapsed")) return true;

        GroupStack.addGroup();
    }

    groupEnd() {
        if (this._settings.alsoConsole)
            this._console.groupEnd.apply(this, arguments);

        if (!this._shouldLog("group") && !this._shouldLog("groupCollapsed"))
            return true;

        var head = GroupStack.removeGroup();
        if (!GroupStack.isEmpty()) {
            // Put the finished group into the still active group
            GroupStack.pushLog({ type: "group", log: head });
        } else {
            return this._logIt([{ type: "group", log: head }], "group");
        }
    }

    info() {
        if (this._settings.alsoConsole)
            this._console.info.apply(this, arguments);

        if (!this._shouldLog("info")) return true;

        var args = this._helpers.argumentsToArray(arguments);
        if (args[0]) {
            var data = this._helpers.collateArguments(args);
            return this._logIt(data, "info");
        }
    }

    log() {
        if (this._settings.alsoConsole)
            this._console.log.apply(this, arguments);

        if (!this._shouldLog("log")) return true;

        var args = this._helpers.argumentsToArray(arguments);
        if (args[0]) {
            var data = this._helpers.collateArguments(args);
            return this._logIt(data, "log");
        }
    }

    table() {
        if (this._settings.alsoConsole)
            this._console.table.apply(this, arguments);

        if (!this._shouldLog("table")) return true;

        var args = this._helpers.argumentsToArray(arguments);
        if (args[0]) {
            var data = this._helpers.collateArguments(args);
            return this._logIt(data, "table");
        }
    }

    time(label) {
        if (this._settings.alsoConsole) this._console.time(label);

        if (!this._shouldLog("time")) return true;

        var timerLabel = label === undefined ? "default" : `${label}`;
        this._timers[timerLabel] = this._now();
    }

    timeEnd(label) {
        if (this._settings.alsoConsole) this._console.timeEnd(label);

        if (!this._shouldLog("time")) return true;

        var timerLabel = label === undefined ? "default" : `${label}`;

        if (this._timers[timerLabel] !== undefined) {
            var elapsed = (this._now() - this._timers[timerLabel]).toFixed(2);
            var data = [`${timerLabel}: ${elapsed}ms`];
            delete this._timers[timerLabel];
            return this._logIt(data, "time");
        }
    }

    trace() {
        if (this._settings.alsoConsole)
            this._console.trace.apply(this, arguments);

        if (!this._shouldLog("trace")) return true;

        var args = this._helpers.argumentsToArray(arguments);
        var data = [];
        if (args[0]) {
            data = this._helpers.collateArguments(args);
        }

        data.push(this._stackTrace(2));
        return this._logIt(data, "trace");
    }

    warn() {
        if (this._settings.alsoConsole)
            this._console.warn.apply(this, arguments);

        if (!this._shouldLog("warn")) return true;

        var args = this._helpers.argumentsToArray(arguments);
        if (args[0]) {
            var data = this._helpers.collateArguments(args);
            return this._logIt(data, "warn");
        }
    }

    /**
     * Stubs for console functions that aren't logged
     */
    clear() {
        if (this._settings.alsoConsole) this._console.clear();
    }

    count() {
        if (this._settings.alsoConsole)
            this._console.count.apply(this, arguments);
    }

    /**
     * Stubs for Non-Standard console functions
     */
    dir() {
        if (this._settings.alsoConsole && this._console.dir !== undefined)
            this._console.dir.apply(this, arguments);
    }

    dirxml() {
        if (this._settings.alsoConsole && this._console.dirxml !== undefined)
            this._console.dirxml.apply(this, arguments);
    }

    profile() {
        if (this._settings.alsoConsole && this._console.profile !== undefined)
            this._console.profile.apply(this, arguments);
    }

    profileEnd() {
        if (
            this._settings.alsoConsole &&
            this._console.profileEnd !== undefined
        )
            this._console.profileEnd.apply(this, arguments);
    }
}
