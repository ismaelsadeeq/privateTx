"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAddress = void 0;
const bitcoin = require("bitcoinjs-lib");
const getAddress = (script) => {
    try {
        return bitcoin.address.fromOutputScript(script);
    }
    catch (err) {
        return script.toString('hex');
    }
};
exports.getAddress = getAddress;
