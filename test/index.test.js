const fs = require("fs");

const chai = require("chai");
const fetchMock = require("fetch-mock");
const nodeFetch = require("node-fetch");

// The Object we are going to test
const ChronicleConsole = require("../index");

// The test data
const TEST_DATA = require("./lib/data");

const generateExpectedFetchBody = require("./lib/generateExpectedFetchBody");

const expect = chai.expect;

// Create the global fetch method
//global.fetch = nodeFetch;

const SERVER = "http://testserver.com";
const APP = "TestApp";
const EXPECTED_HEADERS = { "Content-Type": "text/plain" };
const EXPECTED_METHOD = "post";

const BASIC_CONSOLE_METHODS = ["error", "info", "log", "table", "warn"];

// Monitor all POSTs
fetchMock.post(SERVER, 200);

describe("ChronicleLogger", () => {
    describe("Does Not Log", () => {
        BASIC_CONSOLE_METHODS.forEach(method => {
            describe("Empty Data", () => {
                let _emptyParams = [];

                beforeEach(() => {
                    let config = {
                        server: SERVER,
                        app: APP,
                        clientInfo: {}
                    };
                    ChronicleConsole.init(config);

                    _emptyParams = ["", {}, [], undefined, null];
                });

                afterEach(() => {
                    const fetchedCalls = fetchMock.calls();
                    expect(fetchedCalls).to.be.an("array").that.is.empty;
                    fetchMock.reset();
                });

                it("." + method + "()", () => {
                    ChronicleConsole[method].apply(this, _emptyParams);
                });
            });
        });
    });
    describe("Logs Data to Server", () => {
        TEST_DATA.forEach(testSet => {
            BASIC_CONSOLE_METHODS.forEach(method => {
                describe(testSet.name + "  ." + method + "()", () => {
                    beforeEach(() => {
                        let config = {
                            server: SERVER,
                            app: APP,
                            clientInfo: {}
                        };
                        ChronicleConsole.init(config);
                    });

                    afterEach(() => {
                        const fetchedCalls = fetchMock.calls();
                        expect(fetchedCalls, "Mocked fetch failed.").to.be.an(
                            "array"
                        ).that.is.not.empty;

                        if (fetchedCalls.length > 0) {
                            expect(fetchMock.lastUrl()).to.equal(SERVER);

                            const request = fetchMock.lastOptions();
                            expect(request.method).to.equal(EXPECTED_METHOD);
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
                    });

                    it("sends log to server", () => {
                        ChronicleConsole[method].apply(this, testSet.params);
                    });
                });
            });
        });
    });
});
