const generateRandomParams = require("./generaterandom");

module.exports = [
    {
        name: "Pre-defined Data.",
        params: [
            9876,
            ["one", "two", "three"],
            "A string.",
            { alpha: [0, 1, 2], beta: "Beta string.", theta: 1234 }
        ]
    },
    {
        name: "Pre-defined with Empty Data intermixed.",
        params: [
            9876,
            null,
            ["one", "two", "three"],
            {},
            "A string.",
            [],
            { alpha: [0, 1, 2], beta: "Beta string.", theta: 1234 },
            "",
            undefined
        ]
    },
    {
        name: "Random Data 1",
        params: generateRandomParams()
    },
    {
        name: "Random Data 2",
        params: generateRandomParams()
    },
    {
        name: "Random Data 3",
        params: generateRandomParams()
    },
    {
        name: "Random Data 4",
        params: generateRandomParams()
    },
    {
        name: "Random Data 5",
        params: generateRandomParams()
    }
];
