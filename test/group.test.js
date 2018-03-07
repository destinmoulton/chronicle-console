/**
 * Test .group(), .groupEnd(), .groupCollapsed()
 */

const chai = require("chai");
const mockConsole = require("console-mock");
const mockFetch = require("fetch-mock");
const MockBrowser = require("mock-browser").mocks.MockBrowser;

const expect = chai.expect;

const generateExpectedClient = require("./lib/generateExpectedClient");

const chronicleConsole = require("../dist/chronicleconsole");
const DATA = require("./data/groupData");
const TEST_MODES = require("./data/testmodes");

const METHODS = DATA.METHODS;
const TESTS = DATA.TESTS;

const APP = "MOCHA TEST - .group(), .groupEnd(), .groupCollapsed()";
const SERVER = "http://test.server.chronicle.logger.com";
const EXPECTED_HEADERS = { "Content-Type": "text/plain" };
const EXPECTED_METHOD = "post";

describe("ChronicleConsole - .group(), .groupEnd(), .groupCollapsed()", () => {
    TEST_MODES.forEach(mode => {
        TESTS.forEach(test => {
            describe(mode.title, () => {
                beforeEach(() => {
                    // Monitor all POSTs
                    mockFetch.restore();
                    mockFetch.post(SERVER, 200);
                    mockConsole.enabled(false);
                    mockConsole.historyClear();

                    // Build a mock for the window.navigator
                    mockWindow = new MockBrowser().getWindow();
                    global.navigator = mockWindow.navigator;

                    let methodsToLog = [];

                    if (mode.logEnabled) {
                        methodsToLog = [
                            "group",
                            "groupCollapsed",
                            "groupEnd",
                            "log",
                            "info",
                            "warn",
                            "error",
                            "table"
                        ];
                    }

                    const config = {
                        server: SERVER,
                        app: APP,
                        toConsole: mode.consoleEnabled,
                        consoleObject: mockConsole.create(),
                        globalize: false,
                        methodsToLog
                    };

                    chronicleConsole.init(config);
                });

                it(test.title, () => {
                    let numMethodsCalled = 0;
                    test.sequence.forEach(method => {
                        if (method === "group") {
                            chronicleConsole.group();
                        } else if (method === "groupCollapsed") {
                            chronicleConsole.groupCollapsed();
                        } else if (method === "groupEnd") {
                            chronicleConsole.groupEnd();
                        } else {
                            chronicleConsole[method].apply(
                                chronicleConsole,
                                METHODS[method]
                            );
                        }

                        numMethodsCalled++;
                    });

                    const history = mockConsole.history();
                    if (mode.consoleEnabled) {
                        expect(history)
                            .to.be.an("array")
                            .and.have.length(numMethodsCalled);
                    } else {
                        expect(history)
                            .to.be.an("array")
                            .and.have.length(0);
                    }

                    const fetchedCalls = mockFetch.calls();

                    if (!mode.logEnabled) {
                        expect(fetchedCalls, "Mocked fetch failed.").to.be.an(
                            "array"
                        ).that.is.empty;
                    } else {
                        expect(fetchedCalls, "Mocked fetch failed.")
                            .to.be.an("array")
                            .that.is.length(1);

                        fetchedCalls.forEach((call, index) => {
                            const res = call[1];
                            const {
                                app,
                                client,
                                type,
                                data,
                                trace
                            } = JSON.parse(res.body);
                            expect(call[0]).to.equal(SERVER);
                            expect(res.method).to.equal(EXPECTED_METHOD);
                            expect(res.headers).to.deep.equal(EXPECTED_HEADERS);
                            expect(app).to.equal(APP);
                            expect(type).to.equal("group");
                            expect(data).to.deep.equal([test.expectedData]);
                            expect(client).to.deep.equal(
                                generateExpectedClient(global.navigator)
                            );
                            expect(trace).to.be.length.gt(4);
                        });
                    }
                });
            });
        });
    });
});
