import Moralis from 'moralis';
import { authRequests } from 'src/store';
import { ParseServerRequest } from 'src/utils/ParseServerRequest';

const serverRequest = new ParseServerRequest();

interface ParseUser {
  objectId: string;
}

export interface RequestMessage {
  address: string;
  chain: string;
  networkType: string;
}

const DOMAIN = 'defi.finance';
const STATEMENT = 'Please sign this message to confirm your identity.';
const URI = 'https://defi.finance';
const EXPIRATION_TIME = '2029-01-01T00:00:00.000Z';
const TIMEOUT = 15;

export async function requestMessage({
  address,
  chain,
  networkType,
}: {
  address: string;
  chain: string;
  networkType: 'evm';
}) {
  const result = await Moralis.Auth.requestMessage({
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

export interface VerifyMessage {
  network: string;
  signature: string;
  message: string;
}

export async function verifyMessage({ network, signature, message }: VerifyMessage) {
  const storedData = authRequests.get(message);

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
  const user = await serverRequest.post<ParseUser>({
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
