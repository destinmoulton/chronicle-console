const fs = require("fs");

const chai = require("chai");
const consoleMock = require("console-mock");
const fetchMock = require("fetch-mock");
const nodeFetch = require("node-fetch");

// The test data
const TEST_DATA = require("./lib/data");

const generateExpectedFetchBody = require("./lib/generateExpectedFetchBody");

const expect = chai.expect;

// The Object we are going to test
const ChronicleConsole = require("../index");

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
// Monitor all POSTs
fetchMock.post(SERVER, 200);

describe("ChronicleLogger - Logs Data", () => {
    OPTION_STATES.forEach(optionState => {
        describe(optionState.title, () => {
            TEST_DATA.forEach(testSet => {
                BASIC_CONSOLE_METHODS.forEach(method => {
                    describe(testSet.name + "  ." + method + "()", () => {
                        beforeEach(() => {
                            let config = {
                                server: SERVER,
                                app: APP,
                                clientInfo: {}
                            };

                            if (optionState.consoleIsOn) {
                                consoleMock.enabled(false);
                                consoleMock.historyClear();
                                config["toConsole"] = true;
                                config["globalConsole"] = consoleMock.create();
                            }
                            ChronicleConsole.init(config);
                        });

                        afterEach(() => {
                            const fetchedCalls = fetchMock.calls();

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
                                expect(fetchMock.lastUrl()).to.equal(SERVER);

                                const request = fetchMock.lastOptions();
                                expect(request.method).to.equal(
                                    EXPECTED_METHOD
                                );
                                expect(request.headers).to.deep.equal(
                                    EXPECTED_HEADERS
                                );

                                const body = JSON.parse(request.body);
                                expect(body.app).to.equal(APP);
                                expect(body.type).to.equal(method);
                                expect(body.info).to.deep.equal(
                                    generateExpectedFetchBody(testSet.params)
                                );
                            }

                            fetchMock.reset();

                            if (optionState.consoleIsOn) {
                                const history = consoleMock.history();
                                expect(history)
                                    .to.be.an("array")
                                    .of.length(1);

                                expect(history[0].method).to.be.equal(method);
                                expect(history[0].arguments).to.deep.equal(
                                    testSet.params
                                );
                            }
                        });

                        it("." + method + "()", () => {
                            ChronicleConsole[method].apply(
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
