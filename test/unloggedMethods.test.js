const _ = require("lodash");
const chai = require("chai");

const expect = chai.expect;

const chronicleConsole = require("../index");

const SERVER = "https://apiserver.com/test/";
const APP = "Test Unlogged Methods";

const MockConsole = () => {
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

const mockConsole = MockConsole();

const UNLOGGED_METHODS = [
    "clear",
    "count",
    "dir",
    "dirxml",
    "profile",
    "profileEnd",
    "timeStamp"
];

// Just make sure args are being passed to the console methods
describe("Unlogged Console Methods", () => {
    UNLOGGED_METHODS.forEach(method => {
        describe("console." + method, () => {
            beforeEach(() => {
                mockConsole.historyClear();
                const config = {
                    server: SERVER,
                    app: APP,
                    clientInfo: {},
                    toConsole: true,
                    globalConsole: mockConsole
                };

                chronicleConsole.init(config);
            });

            it("called correctly", () => {
                const params = ["A String", { an: "object" }, ["array"], 0];
                chronicleConsole[method].apply(this, params);

                const history = mockConsole.history();
                expect(history)
                    .to.be.an("array")
                    .and.have.length(1);
                expect(history[0].method).to.be.equal(method);
            });
        });
    });
});
