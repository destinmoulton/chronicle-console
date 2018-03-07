const chai = require("chai");
const mockConsole = require("console-mock");
const mockFetch = require("fetch-mock");
const MockBrowser = require("mock-browser").mocks.MockBrowser;

const expect = chai.expect;

const generateExpectedClient = require("./lib/generateExpectedClient");

const ChronicleConsole = require("../dist/chronicleconsole");

const SERVER = "http://serverapi.org/";
const APP = "Time Test";
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

describe("ChronicleConsole time/timeEnd Methods", () => {
    TESTS.forEach(test => {
        beforeEach(() => {
            // Monitor all POSTs
            mockFetch.restore();
            mockFetch.post(SERVER, 200);
            mockConsole.enabled(false);
            mockConsole.historyClear();

            // Build a mock for the window.navigator
            global.window = new MockBrowser().getWindow();

            const config = {
                server: SERVER,
                app: APP,
                toConsole: true,
                consoleObject: mockConsole.create()
            };

            ChronicleConsole.init(config);
        });
        it(test.name, () => {
            test.timers.forEach(timer => {
                ChronicleConsole.time(timer);
                ChronicleConsole.timeEnd(timer);
            });

            const history = mockConsole.history();
            expect(history)
                .to.be.an("array")
                .and.have.length(test.timers.length * 2);

            test.timers.forEach((timer, index) => {
                const ind = index * 2;
                expect(history[ind].method).to.be.equal("time");
                expect(history[ind + 1].method).to.be.equal("timeEnd");
                expect(history[ind].arguments[0]).to.be.equal(timer);
                expect(history[ind + 1].arguments[0]).to.be.equal(timer);
            });

            const fetchedCalls = mockFetch.calls();

            expect(fetchedCalls, "Mocked fetch failed.")
                .to.be.an("array")
                .that.is.length(test.timers.length);

            fetchedCalls.forEach((call, index) => {
                const details = call[1];
                const body = JSON.parse(details.body);
                expect(call[0]).to.equal(SERVER);
                expect(details.method).to.equal(EXPECTED_METHOD);
                expect(details.headers).to.deep.equal(EXPECTED_HEADERS);
                expect(body.app).to.equal(APP);
                expect(body.type).to.equal("time");
                expect(body.data).to.include(test.expectedName);
                expect(body.data).to.include("ms");
                expect(body.client).to.deep.equal(
                    generateExpectedClient(global.window.navigator)
                );
            });

            mockFetch.reset();
        });
    });
});
