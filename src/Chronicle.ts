/**
 * Console methods.
 */

import GroupStack from "./GroupStack";
import ArgHelpers from "./ArgHelpers";
import EnvironmentParser from "./EnvironmentParser";

import * as Types from "./types";

const DEFAULT_METHODS_TO_LOG = ["action", "assert", "error", "warn"];

export default class Chronicle {
    private _settings: Types.ISettings = {
        serverURL: "",
        appName: "",
        env: null,
        alsoConsole: true,
        globalize: true,
        methodsToLog: DEFAULT_METHODS_TO_LOG,
        customMethods: []
    };

    private _argHelpers: ArgHelpers;
    private _environmentParser: EnvironmentParser;
    private _groupStack: GroupStack;

    private _global: any; // Either Window or global
    private _console = console;
    private _fetch: any;
    private _timers = Object.create(null);

    constructor(argHelpers, environmentParser, groupStack) {
        if (typeof window !== "undefined") {
            this._global = window;
        } else if (typeof global !== "undefined") {
            this._global = global;
        } else {
            console.error("ChronicleConsole :: No global defined.");
        }
        //this._global = global;
        this._argHelpers = argHelpers;
        this._environmentParser = environmentParser;
        this._groupStack = groupStack;
    }

    init(config) {
        this._settings.serverURL = config.server || "";
        this._settings.appName = config.app || "";
        this._settings.env = config.env || null; // The users environment info

        if ("toConsole" in config) {
            this._settings.alsoConsole = config.toConsole;
        }

        if ("globalize" in config) {
            this._settings.globalize = config.globalize;
        }

        // The methods that should be logged to the server
        this._settings.methodsToLog =
            config.methodsToLog || DEFAULT_METHODS_TO_LOG;

        // Custom logging methods
        this._settings.customMethods = config.customMethods || [];
        this._registerCustomMethods();

        // Setup the global console
        this._console = config.consoleObject || console;
        if (this._settings.globalize) {
            this._overwriteGlobalConsole();
        }

        var navigatorIsAvailable = typeof this._global.navigator === "object";

        if (!this._settings.env && navigatorIsAvailable) {
            // Set the default to window navigator if available
            this._settings.env = this._global.navigator;
        }

        if (typeof this._global.fetch !== "undefined") {
            // Define the local fetch method
            // bound to the global context
            this._fetch = this._global.fetch.bind(this._global);
        } else {
            this._console.error(
                "ChronicleConsole :: No fetch() method defined."
            );
        }
    }

    private _overwriteGlobalConsole() {
        if (typeof this._global.console !== "undefined") {
            //(<any>console) = this;
            this._global.console = this;
        }
    }

    private _registerCustomMethods() {
        const self = this;
        this._settings.customMethods.forEach(method => {
            if (typeof self[method] === "undefined") {
                self[method] = function() {
                    var args = self._argHelpers.argumentsToArray(arguments);
                    if (args[0]) {
                        var data = self._argHelpers.collateArguments(args);
                        return self._logIt(data, method);
                    }
                };
            }
        });
    }

    private _logIt(data, type) {
        if (!this._argHelpers.isArray(data) || data.length === 0) {
            // Only allow arrays
            return true;
        }

        if (this._groupStack.isEmpty()) {
            return this._sendData(data, type);
        }

        // The zeroth element (head) holds the current group
        this._groupStack.pushLog({ log: data, type });
    }

    private _sendData(data, type) {
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

        this._fetch(this._settings.serverURL, params).catch(err =>
            this._console.error(err)
        );

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
        const stackString = new Error().stack;
        // Remove the trace lines for this and trace() call
        // from depth to -1 (the split adds an extra empty element)
        const traces = stackString.split("\n").slice(depth, -1);

        const cleanTraces = traces.map(trace => {
            // Clean the "    at " from the beginning of the traces
            return trace.replace(/^\s*at\s*/, "");
        });

        return cleanTraces;
    }

    /**
     * This is a method not provided by the
     * standard/global console. This method is
     * used for logging user actions.
     */
    action() {
        if (!this._shouldLog("action")) return true;

        var args = this._argHelpers.argumentsToArray(arguments);
        if (args[0]) {
            var data = this._argHelpers.collateArguments(args);
            return this._logIt(data, "action");
        }
    }

    assert(assertion) {
        if (this._settings.alsoConsole)
            this._console.assert.apply(this, arguments);

        if (!this._shouldLog("assert")) return true;

        if (!assertion) {
            var args = this._argHelpers.argumentsToArray(arguments);
            return this._logIt(
                this._argHelpers.collateArguments(args.slice(1)),
                "assert"
            );
        }
    }

    error() {
        if (this._settings.alsoConsole)
            this._console.error.apply(this, arguments);

        if (!this._shouldLog("error")) return true;

        var args = this._argHelpers.argumentsToArray(arguments);
        if (args[0]) {
            var data = this._argHelpers.collateArguments(args);
            return this._logIt(data, "error");
        }
    }

    group() {
        if (this._settings.alsoConsole)
            this._console.group.apply(this, arguments);

        if (!this._shouldLog("group")) return true;

        this._groupStack.addGroup();
    }

    groupCollapsed() {
        if (this._settings.alsoConsole)
            this._console.groupCollapsed.apply(this, arguments);

        if (!this._shouldLog("groupCollapsed")) return true;

        this._groupStack.addGroup();
    }

    groupEnd() {
        if (this._settings.alsoConsole)
            this._console.groupEnd.apply(this, arguments);

        if (!this._shouldLog("group") && !this._shouldLog("groupCollapsed"))
            return true;

        var head = this._groupStack.removeGroup();
        if (!this._groupStack.isEmpty()) {
            // Put the finished group into the still active group
            this._groupStack.pushLog({ type: "group", log: head });
        } else {
            return this._logIt([{ type: "group", log: head }], "group");
        }
    }

    info() {
        if (this._settings.alsoConsole)
            this._console.info.apply(this, arguments);

        if (!this._shouldLog("info")) return true;

        var args = this._argHelpers.argumentsToArray(arguments);
        if (args[0]) {
            var data = this._argHelpers.collateArguments(args);
            return this._logIt(data, "info");
        }
    }

    log() {
        if (this._settings.alsoConsole)
            this._console.log.apply(this, arguments);

        if (!this._shouldLog("log")) return true;

        var args = this._argHelpers.argumentsToArray(arguments);
        if (args[0]) {
            var data = this._argHelpers.collateArguments(args);
            return this._logIt(data, "log");
        }
    }

    table() {
        if (this._settings.alsoConsole)
            this._console.table.apply(this, arguments);

        if (!this._shouldLog("table")) return true;

        var args = this._argHelpers.argumentsToArray(arguments);
        if (args[0]) {
            var data = this._argHelpers.collateArguments(args);
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

        var args = this._argHelpers.argumentsToArray(arguments);
        var data = [];
        if (args[0]) {
            data = this._argHelpers.collateArguments(args);
        }

        data.push(this._stackTrace(2));
        return this._logIt(data, "trace");
    }

    warn() {
        if (this._settings.alsoConsole)
            this._console.warn.apply(this, arguments);

        if (!this._shouldLog("warn")) return true;

        var args = this._argHelpers.argumentsToArray(arguments);
        if (args[0]) {
            var data = this._argHelpers.collateArguments(args);
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
