"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyMessage = exports.requestMessage = void 0;
const moralis_1 = __importDefault(require("moralis"));
const store_1 = require("src/store");
const ParseServerRequest_1 = require("src/utils/ParseServerRequest");
const serverRequest = new ParseServerRequest_1.ParseServerRequest();
const DOMAIN = 'defi.finance';
const STATEMENT = 'Please sign this message to confirm your identity.';
const URI = 'https://defi.finance';
const EXPIRATION_TIME = '2029-01-01T00:00:00.000Z';
const TIMEOUT = 15;
async function requestMessage({ address, chain, networkType, }) {
    const result = await moralis_1.default.Auth.requestMessage({
        address,
        chain,
        networkType,
        domain: DOMAIN,
        statement: STATEMENT,
        uri: URI,
        expirationTime: EXPIRATION_TIME,
        timeout: TIMEOUT,
    });
    const { message } = result.toJSON();
    return message;
}
exports.requestMessage = requestMessage;
async function verifyMessage({ network, signature, message }) {
    const storedData = store_1.authRequests.get(message);
    if (!storedData) {
        throw new Error('Invalid message');
    }
    const { id: storedId, profileId: storedProfileId } = storedData;
    const authData = {
        id: storedProfileId,
        authId: storedId,
        message,
        signature,
        network,
    };
    // Authenticate
    const user = await serverRequest.post({
        endpoint: `/users`,
        params: {
            authData: {
                moralis: authData,
            },
        },
        useMasterKey: true,
    });
    // Update user moralisProfile column
    await serverRequest.put({
        endpoint: `/users/${user.objectId}`,
        params: {
            moralisProfileId: storedProfileId,
        },
        useMasterKey: true,
    });
    // Get authenticated user
    const updatedUser = await serverRequest.get({
        endpoint: `/users/${user.objectId}`,
        useMasterKey: true,
    });
    return updatedUser;
}
exports.verifyMessage = verifyMessage;
//# sourceMappingURL=authService.js.map