const fs = require("fs");

const chai = require("chai");
const mockConsole = require("console-mock");
const mockFetch = require("fetch-mock");
const MockBrowser = require("mock-browser").mocks.MockBrowser;
const nodeFetch = require("node-fetch");

// The test data
const TEST_DATA = require("./data/data");

const generateExpectedFetchBody = require("./lib/generateExpectedFetchBody");

const expect = chai.expect;

// The Object we are going to test
const ChronicleConsole = require("../dist/chronicleconsole");

const SERVER = "http://testserver.com";
const APP = "TestApp";
const EXPECTED_HEADERS = { "Content-Type": "text/plain" };
const EXPECTED_METHOD = "post";

const BASIC_CONSOLE_METHODS = ["error", "info", "log", "table", "warn"];

const OPTION_STATES = [
    {
        title: "Console and Server",
        consoleIsOn: true
    },
    {
        title: "Just Server",
        consoleIsOn: false
    }
];

describe("ChronicleLogger Basic Methods", () => {
    OPTION_STATES.forEach(optionState => {
        describe(optionState.title, () => {
            TEST_DATA.forEach(testSet => {
                BASIC_CONSOLE_METHODS.forEach(logtype => {
                    describe(testSet.name + "  ." + logtype + "()", () => {
                        beforeEach(() => {
                            // Monitor all POSTs
                            mockFetch.restore();
                            mockFetch.post(SERVER, 200);

                            // Build a mock for the window.navigator
                            mockWindow = new MockBrowser().getWindow();
                            global.navigator = mockWindow.navigator;

                            let config = {
                                server: SERVER,
                                app: APP
                            };

                            if (optionState.consoleIsOn) {
                                mockConsole.enabled(false);
                                mockConsole.historyClear();
                                config["toConsole"] = true;
                                config["consoleObject"] = mockConsole.create();
                            }
                            ChronicleConsole.init(config);
                        });

                        afterEach(() => {
                            const fetchedCalls = mockFetch.calls();

                            if (testSet.shouldLogToServer) {
                                expect(
                                    fetchedCalls,
                                    "Mocked fetch failed."
                                ).to.be.an("array").that.is.not.empty;
                            } else {
                                expect(
                                    fetchedCalls,
                                    "Mock fetch ran when it shouldn't."
                                ).to.be.an("array").that.is.empty;
                            }

                            if (testSet.shouldLogToServer) {
                                expect(mockFetch.lastUrl()).to.equal(SERVER);

                                const request = mockFetch.lastOptions();
                                expect(request.method).to.equal(
                                    EXPECTED_METHOD
                                );
                                expect(request.headers).to.deep.equal(
                                    EXPECTED_HEADERS
                                );

                                const parsedBody = JSON.parse(request.body);
                                const expectedFetchBody = generateExpectedFetchBody(
                                    APP,
                                    logtype,
                                    global.window.navigator,
                                    testSet.params
                                );
                                expect(parsedBody).to.deep.equal(
                                    expectedFetchBody
                                );
                            }

                            if (optionState.consoleIsOn) {
                                const history = mockConsole.history();
                                expect(history, "Console history is incorrect!")
                                    .to.be.an("array")
                                    .of.length(1);

                                expect(history[0].method).to.be.equal(logtype);
                                expect(history[0].arguments).to.deep.equal(
                                    testSet.params
                                );
                            }
                        });

                        it("." + logtype + "()", () => {
                            ChronicleConsole[logtype].apply(
                                this,
                                testSet.params
                            );
                        });
                    });
                });
            });
        });
    });
});
