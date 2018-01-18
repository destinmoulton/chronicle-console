const fs = require("fs");

const chai = require("chai");
const fetchMock = require("fetch-mock");
const nodeFetch = require("node-fetch");

const ChronicleConsole = require("../index");
const generateRandomParams = require("./generaterandom");

const expect = chai.expect;

// Create the global fetch method
//global.fetch = nodeFetch;

const SERVER = "http://testserver.com";
const APP = "TestApp";
const EXPECTED_HEADERS = { "Content-Type": "text/plain" };
const EXPECTED_METHOD = "post";

const BASIC_CONSOLE_METHODS = ["error", "info", "log", "table", "warn"];

function expectedBody(params) {
    let data = null;
    if (params.length > 1) {
        data = [];
        for (let i = 0; i < params.length; i++) {
            data.push(JSON.parse(JSON.stringify(params[i])));
        }
    } else {
        data = params[0];
    }

    return data;
}

// Monitor all POSTs
fetchMock.post(SERVER, 200);

describe("ChronicleLogger", () => {
    describe("Logs to Server", () => {
        BASIC_CONSOLE_METHODS.forEach(method => {
            describe("using console method ", () => {
                let _randomParams = [];

                beforeEach(() => {
                    let config = {
                        server: SERVER,
                        app: APP,
                        clientInfo: {}
                    };
                    ChronicleConsole.init(config);

                    // Generate a new set of random parameters
                    _randomParams = generateRandomParams();

                    // Log to file
                    var toLog =
                        "\n\nconsole." +
                        method +
                        "() ------------ \n" +
                        JSON.stringify(_randomParams);

                    fs.appendFileSync("./paramlog.txt", toLog);
                });

                afterEach(() => {
                    const fetchMockComplete = fetchMock.done();
                    expect(fetchMockComplete).to.equal(true);
                    if (!fetchMockComplete) {
                        console.error(_randomParams);
                    }

                    expect(fetchMock.lastUrl()).to.equal(SERVER);

                    const request = fetchMock.lastOptions();
                    expect(request.method).to.equal(EXPECTED_METHOD);
                    expect(request.headers).to.deep.equal(EXPECTED_HEADERS);

                    const body = JSON.parse(request.body);
                    expect(body.app).to.equal(APP);
                    expect(body.type).to.equal(method);
                    expect(body.info).to.deep.equal(
                        expectedBody(_randomParams)
                    );

                    fetchMock.reset();
                });

                it("." + method + "()", () => {
                    ChronicleConsole[method].apply(this, _randomParams);
                });
            });
        });
    });
});
