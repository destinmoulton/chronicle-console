const faker = require("faker");

const fakerFunctions = require("./fakeables");

function generateRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}
function getRandomFaker() {
    const parents = Object.keys(fakerFunctions);

    const randomKeyIndex = generateRandomInt(parents.length);

    const parentFaker = parents[randomKeyIndex];

    const generators = fakerFunctions[parentFaker];

    const randomGenIndex = generateRandomInt(generators.length);

    const childFaker = generators[randomGenIndex];
    return {
        parent: parentFaker,
        child: childFaker,
        data: faker[parentFaker][childFaker]()
    };
}

function generateRandomString() {
    const rando = getRandomFaker();
    return rando.data;
}

function generateRandomObject() {
    const numElements = generateRandomInt(30);

    const obj = {};
    for (var i = 0; i < numElements; i++) {
        const rando = getRandomFaker();
        obj[rando.child] = rando.data;
    }
    return obj;
}

function generateRandomArray() {
    const numElements = generateRandomInt(50);

    const arr = [];
    for (var i = 0; i < numElements; i++) {
        const rando = getRandomFaker();
        arr.push(rando.data);
    }
    return arr;
}

function generateRandomElement() {
    const type = generateRandomInt(3);
    switch (type) {
        case 0:
            return generateRandomString();
        case 1:
            return generateRandomObject();
        case 2:
            return generateRandomArray();
    }
}

function generateRandomParameters() {
    const count = generateRandomInt(6);
    let params = [];
    for (var i = 0; i < count; i++) {
        params.push(generateRandomElement());
    }
    return params;
}

module.exports = generateRandomParameters;
