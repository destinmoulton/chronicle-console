const chai = require("chai");
const fetchMock = require("fetch-mock");
const nodeFetch = require("node-fetch");

const ChronicleConsole = require("../index");

const expect = chai.expect;

describe("ChronicleLogger", () => {
    describe("performs server logging", () => {
        let _testServer = "http://testserver.com";
        let _app = "TestApp";

        beforeEach(() => {
            global.fetch = nodeFetch;
            fetchMock.post("*", 200);
            let config = {
                server: _testServer,
                app: _app,
                clientInfo: {}
            };
            ChronicleConsole.init(config);
        });

        afterEach(() => {
            fetchMock.reset();
        });

        it("log()", () => {
            ChronicleConsole.log("Test String");
            expect(fetchMock.lastUrl()).to.equal(_testServer);
        });
    });
});
