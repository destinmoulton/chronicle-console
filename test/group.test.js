/**
 * Test .group(), .groupEnd(), .groupCollapsed()
 */

const chai = require("chai");
const consoleMock = require("console-mock");
const fetchMock = require("fetch-mock");

const expect = chai.expect;

const chronicleLogger = require("../index");

const APP = "TEST GROUP APP";
const SERVER = "https://servername.com";
const EXPECTED_HEADERS = { "Content-Type": "text/plain" };
const EXPECTED_METHOD = "post";

const CONSOLE_OPTIONS = [
    { name: "DOES log to the console.", consoleEnabled: true },
    {
        name: "Does NOT log to the console.",
        consoleEnabled: false
    }
];

const METHODS = [
    {
        type: "log",
        args: ["Alpha", [1, 2, 3]]
    },

    {
        type: "info",
        args: [{ a: "First", b: "Second" }, "Beta"]
    },

    {
        type: "warn",
        args: [["c", "b", "a"], { one: 1, two: 2 }]
    },
    {
        type: "error",
        args: ["ERROR: ", "SOMETHING WENT WRONG!"]
    },
    {
        type: "table",
        args: [{ a: "alpha", b: "beta" }]
    }
];

const TESTS = [
    {
        title: "Flat group (depth 1).",
        data: [METHODS]
    },
    {
        title: "Nested group (depth 2).",
        data: [METHODS.slice(2), METHODS.slice(0, 2)]
    },
    {
        title: "Nested group (depth 3).",
        data: [Methods.slice(0, 2), METHODS[2], METHODS.slice(3)]
    }
];

fetchMock.post(SERVER, "*");
describe("ChronicleLogger .group(), .groupEnd(), .groupCollapsed()", () => {
    CONSOLE_OPTIONS.forEach(consoleOption => {
        TESTS.forEach(test => {
            describe("Logs trace to server", () => {
                beforeEach(() => {
                    fetchMock.reset();
                    consoleMock.enabled(false);
                    consoleMock.historyClear();
                    const config = {
                        server: SERVER,
                        app: APP,
                        clientInfo: {},
                        toConsole: consoleOption.consoleEnabled,
                        globalConsole: consoleMock.create()
                    };

                    chronicleLogger.init(config);
                });

                it(consoleOption.name + " - " + test.title, () => {
                    test.data.forEach(methods => {
                        chronicleLogger.group();
                        methods.forEach(method => {
                            chronicleLogger[method.type].apply(
                                this,
                                method.args
                            );
                        });
                    });

                    test.data.forEach(methods => {
                        chronicleLogger.groupEnd();
                    });

                    const history = consoleMock.history();
                    if (consoleOption.consoleEnabled) {
                        expect(history)
                            .to.be.an("array")
                            .and.have.length(1);
                    } else {
                        expect(history)
                            .to.be.an("array")
                            .and.have.length(0);
                    }

                    const fetchedCalls = fetchMock.calls();

                    expect(fetchedCalls, "Mocked fetch failed.")
                        .to.be.an("array")
                        .that.is.length(1);

                    fetchedCalls.forEach((call, index) => {
                        const details = call[1];
                        const body = JSON.parse(details.body);
                        expect(call[0]).to.equal(SERVER);
                        expect(details.method).to.equal(EXPECTED_METHOD);
                        expect(details.headers).to.deep.equal(EXPECTED_HEADERS);
                        expect(body.app).to.equal(APP);
                        expect(body.type).to.equal("group");
                        expect(body.info).to.be.an("array").that.is.not.empty;
                    });
                });
            });
        });
    });
});
