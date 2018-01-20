const _ = require("lodash");

/**
 * A mock console that includes methods that console-mock does not.
 */
const ChronicleMockConsole = () => {
    let _history = [];

    function history() {
        return _history;
    }

    function historyClear() {
        _history = [];
    }

    function clear() {
        _history.push({ method: "clear", arguments: _.toArray(arguments) });
    }

    function count() {
        _history.push({ method: "count", arguments: _.toArray(arguments) });
    }

    function dir() {
        _history.push({ method: "dir", arguments: _.toArray(arguments) });
    }

    function dirxml() {
        _history.push({ method: "dirxml", arguments: _.toArray(arguments) });
    }

    function profile() {
        _history.push({ method: "profile", arguments: _.toArray(arguments) });
    }

    function profileEnd() {
        _history.push({
            method: "profileEnd",
            arguments: _.toArray(arguments)
        });
    }

    function timeStamp() {
        _history.push({ method: "timeStamp", arguments: _.toArray(arguments) });
    }

    return {
        history,
        historyClear,
        clear,
        count,
        dir,
        dirxml,
        profile,
        profileEnd,
        timeStamp
    };
};

module.exports = ChronicleMockConsole;
