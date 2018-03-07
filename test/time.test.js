const chai = require("chai");
const mockConsole = require("console-mock");
const mockFetch = require("fetch-mock");
const MockBrowser = require("mock-browser").mocks.MockBrowser;

const expect = chai.expect;

const generateExpectedClient = require("./lib/generateExpectedClient");

const ChronicleConsole = require("../dist/chronicleconsole");

const TEST_MODES = require("./data/testmodes");

const SERVER = "http://test.server.chronicle.logger.com";
const APP = "MOCHA TEST - .time() & .timeEnd()";
const EXPECTED_HEADERS = { "Content-Type": "text/plain" };
const EXPECTED_METHOD = "post";

const TESTS = [
    {
        name: ".time(undefined)",
        expectedName: "default",
        timers: [undefined]
    },
    {
        name: ".time(TestLabelOne)",
        expectedName: "TestLabelOne",
        timers: ["TestLabelOne"]
    }
];

describe("ChronicleConsole - .time() & .timeEnd() Methods", () => {
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
                        methodsToLog = ["time", "timeEnd"];
                    }
                    const config = {
                        server: SERVER,
                        app: APP,
                        toConsole: mode.consoleEnabled,
                        consoleObject: mockConsole.create(),
                        globalize: false,
                        methodsToLog
                    };

                    ChronicleConsole.init(config);
                });
                it(test.name, () => {
                    test.timers.forEach(timer => {
                        ChronicleConsole.time(timer);
                        ChronicleConsole.timeEnd(timer);
                    });

                    const history = mockConsole.history();
                    if (!mode.consoleEnabled) {
                        expect(history)
                            .to.be.an("array")
                            .and.have.length(0);
                    } else {
                        expect(history)
                            .to.be.an("array")
                            .and.have.length(test.timers.length * 2);

                        test.timers.forEach((timer, index) => {
                            const ind = index * 2;
                            expect(history[ind].method).to.be.equal("time");
                            expect(history[ind + 1].method).to.be.equal(
                                "timeEnd"
                            );
                            expect(history[ind].arguments[0]).to.be.equal(
                                timer
                            );
                            expect(history[ind + 1].arguments[0]).to.be.equal(
                                timer
                            );
                        });
                    }

                    const fetchedCalls = mockFetch.calls();
                    if (!mode.logEnabled) {
                        expect(fetchedCalls, "Mocked fetch failed.").to.be.an(
                            "array"
                        ).that.is.empty;
                    } else {
                        expect(fetchedCalls, "Mocked fetch failed.")
                            .to.be.an("array")
                            .that.is.length(test.timers.length);

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
                            expect(type).to.equal("time");
                            expect(data[0]).to.include(test.expectedName);
                            expect(data[0]).to.include("ms");
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
