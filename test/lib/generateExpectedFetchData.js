const _ = require("lodash");

const generateExpectedClient = require("./generateExpectedClient");

function isParamValid(param) {
    if (param === null || param === undefined) {
        return false;
    }

    if (_.isArray(param) || _.isString(param)) {
        return param.length > 0;
    } else if (_.isNumber(param)) {
        return true;
    } else if (_.isObject(param)) {
        return !_.isEmpty(param);
    }
    return true;
}

function generateParamData(params) {
    let data = null;
    if (params.length > 1) {
        data = [];
        for (let i = 0; i < params.length; i++) {
            if (isParamValid(params[i])) {
                data.push(JSON.parse(JSON.stringify(params[i])));
            }
        }
    } else {
        data = JSON.parse(JSON.stringify(params[0]));
    }

    return data;
}

/**
 * Generate the expected fetch body.
 *
 * @param array params
 */
function generateExpectedFetchBody(app, logtype, navigator, params) {
    const data = generateParamData(params);
    const client = generateExpectedClient(navigator);

    return {
        app,
        client,
        data,
        type: logtype
    };
}

module.exports = { generateParamData };
