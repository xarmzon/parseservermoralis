/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
declare const Parse: any;
import './generated/evmApi';
import './generated/solApi';
import { requestMessage, verifyMessage } from '../auth/authService';

Parse.Cloud.define('requestMessage', async ({ params }: any) => {
  const { address, chain, networkType } = params;

  const message = await requestMessage({
    address,
    chain,
    networkType,
  });

  return { message };
});
Parse.Cloud.define('verifyMessage', async ({ params }: any) => {
  const { network, signature, message } = params;

  const user = await verifyMessage({
    network,
    signature,
    message,
  });

  return { user };
});

Parse.Cloud.define('getPluginSpecs', () => {
  // Not implemented, only exists to remove client-side errors when using the moralis-v1 package
  return [];
});

Parse.Cloud.define('getServerTime', () => {
  // Not implemented, only excists to remove client-side errors when using the moralis-v1 package
  return null;
});
