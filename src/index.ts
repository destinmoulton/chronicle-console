import ChronicleConsole from "./ChronicleConsole";
import ArgHelpers from "./ArgHelpers";
import EnvironmentParser from "./EnvironmentParser";
import GroupStack from "./GroupStack";
/// <reference types="requirejs" />
/// <reference types="node" />

/**
 * ChronicleConsole
 */
(function(global, factory) {
    var appName = "ChronicleConsole";
    if (typeof window === "object") {
        window[appName] = factory();
    } else if (typeof exports === "object" && typeof module === "object") {
        module.exports = factory();
    } else if (typeof define === "function" && define.amd) {
        define(appName, [], factory);
    } else if (typeof exports === "object") {
        exports[appName] = factory();
    } else {
        global[appName] = factory();
    }
})(this, function() {
    const argHelpers = new ArgHelpers();
    const environmentParser = new EnvironmentParser();
    const groupStack = new GroupStack();
    return new ChronicleConsole(argHelpers, environmentParser, groupStack);
});
