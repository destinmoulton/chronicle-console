/**
 * A list of the available faker data keyed and arrayed.
 *
 * For use by the random data generator.
 */

module.exports = {
    address: [
        "zipCode",
        "city",
        "cityPrefix",
        "citySuffix",
        "streetName",
        "streetAddress",
        "streetSuffix",
        "streetPrefix",
        "secondaryAddress",
        "county",
        "country",
        "countryCode",
        "state",
        "stateAbbr",
        "latitude",
        "longitude"
    ],
    commerce: [
        "color",
        "department",
        "productName",
        "price",
        "productAdjective",
        "productMaterial",
        "product"
    ],
    company: [
        "suffixes",
        "companyName",
        "companySuffix",
        "catchPhrase",
        "bs",
        "catchPhraseAdjective",
        "catchPhraseDescriptor",
        "catchPhraseNoun",
        "bsAdjective",
        "bsBuzz",
        "bsNoun"
    ],
    database: ["column", "type", "collation", "engine"],
    date: ["past", "future", "between", "recent", "month", "weekday"],
    finance: [
        "account",
        "accountName",
        "mask",
        "amount",
        "transactionType",
        "currencyCode",
        "currencyName",
        "currencySymbol",
        "bitcoinAddress",
        "iban",
        "bic"
    ],
    hacker: ["abbreviation", "adjective", "noun", "verb", "ingverb", "phrase"],
    internet: [
        "avatar",
        "email",
        "exampleEmail",
        "userName",
        "protocol",
        "url",
        "domainName",
        "domainSuffix",
        "domainWord",
        "ip",
        "ipv6",
        "userAgent",
        "color",
        "mac",
        "password"
    ],
    lorem: [
        "word",
        "words",
        "sentence",
        "slug",
        "sentences",
        "paragraph",
        "paragraphs",
        "text",
        "lines"
    ],
    name: [
        "firstName",
        "lastName",
        "findName",
        "jobTitle",
        "prefix",
        "suffix",
        "title",
        "jobDescriptor",
        "jobArea",
        "jobType"
    ],
    phone: ["phoneNumber", "phoneNumberFormat", "phoneFormats"],
    random: [
        "number",
        "arrayElement",
        "objectElement",
        "uuid",
        "boolean",
        "word",
        "words",
        "image",
        "locale",
        "alphaNumeric"
    ],
    system: [
        "fileName",
        "commonFileName",
        "mimeType",
        "commonFileType",
        "commonFileExt",
        "fileType",
        "fileExt",
        "directoryPath",
        "filePath",
        "semver"
    ]
};
