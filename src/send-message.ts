import { ethers } from 'ethers';

let privateKey = ""; // Session consistent private key

function ensurePrivateKey(): string {
  if (!privateKey) {
    const wallet = ethers.Wallet.createRandom();
    privateKey = wallet.privateKey;
  }
  return privateKey;
}

async function signAndSend(
  originChain: string,
  mailboxAddress: string,
  rpcUrl: string,
  destinationChain: string,
  message: string
) {
  try {
    const privateKey = ensurePrivateKey();
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(privateKey, provider);
    const messageData = ethers.toUtf8Bytes(message);
    const signature = await wallet.signMessage(messageData);

    console.log('Simulating message sending:');
    console.log('Origin Chain:', originChain);
    console.log('Mailbox Address:', mailboxAddress);
    console.log('Destination Chain:', destinationChain);
    console.log('Message:', message);
    console.log('Signature:', signature);
  } catch (error) {
    console.error('Error sending message:', error);
  }
}

export default signAndSend;