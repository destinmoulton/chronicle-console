/**
 * Generate random objects, arrays, and strings
 * for testing.
 *
 * Uses the faker library.
 */
const faker = require("faker");

const fakerFunctions = require("./fakeables");

// min inclusive, max inclusive random number
function generateRandomInt(min, max) {
    const rand = Math.floor(Math.random() * (max - min + 1)) + min;
    return rand;
}

function getRandomFaker() {
    const parents = Object.keys(fakerFunctions);

    const randomKeyIndex = generateRandomInt(0, parents.length - 1);

    const parentFaker = parents[randomKeyIndex];

    const generators = fakerFunctions[parentFaker];

    const randomGenIndex = generateRandomInt(0, generators.length - 1);

    const childFaker = generators[randomGenIndex];

    const data =
        faker[parentFaker][childFaker]() ||
        `UNKNOWN FAKER FUNCTION ${parentFaker} > ${childFaker}`;
    return {
        parent: parentFaker,
        child: childFaker,
        data: `${data}`
    };
}

function generateRandomString() {
    const rando = getRandomFaker();
    return rando.data;
}

function generateRandomObject() {
    const numElements = generateRandomInt(0, 6);

    const obj = {};
    for (var i = 0; i < numElements; i++) {
        const rando = getRandomFaker();
        obj[rando.child] = rando.data;
    }
    return obj;
}

function generateRandomArray() {
    const numElements = generateRandomInt(0, 10);

    const arr = [];
    for (var i = 0; i < numElements; i++) {
        const rando = getRandomFaker();
        arr.push(rando.data);
    }
    return arr;
}

/**
 * Randomly generate either a string, object, array, or number.
 */
function generateRandomElement() {
    const type = generateRandomInt(0, 3);
    switch (type) {
        case 0:
            return generateRandomString();
        case 1:
            return generateRandomObject();
        case 2:
            return generateRandomArray();
        case 3:
            return generateRandomInt(0, 999999);
    }
}

function generateRandomParameters() {
    const count = generateRandomInt(1, 6);
    let params = [];
    for (var i = 0; i < count; i++) {
        params.push(generateRandomElement());
    }

    if (params.length === 0) {
        // MAKE SURE THAT PARAMS ARE GENERATED
        return generateRandomParameters();
    }
    return params;
}

module.exports = generateRandomParameters;
