import { ethers } from 'ethers';


export interface MatchingListElement {
  originDomain?: '*' | number | number[];
  senderAddress?: '*' | string | string[];
  destinationDomain?: '*' | number | number[];
  recipientAddress?: '*' | string | string[];
}


export async function searchMessages(
  chain: string,
  mailboxAddress: string,
  matchingListJson: string
) {
  try {
    console.log('Matching List JSON:', matchingListJson);
    console.log('Inside searchMessages'); 

    const provider = new ethers.JsonRpcProvider(chain);
    const matchingList: MatchingListElement = JSON.parse(matchingListJson);

    const filter = {
      address: mailboxAddress,
      topics: [ethers.keccak256('Dispatch(address,bytes32,bytes)')],
    };

    const logs = await provider.getLogs(filter);

    console.log('Matching logs:', logs);

    const abiCoder = new ethers.AbiCoder();

    for (const log of logs) {
      const parsedLog = abiCoder.decode(
        ['address', 'bytes32', 'bytes'],
        ethers.getBytes(log.data)
      );

      const sender = parsedLog[0];
      const messageId = parsedLog[1];
      const messageData = parsedLog[2];

      if (matchesMatchingList(sender, messageId, matchingList)) {
        console.log('Matching message:');
        console.log('Sender:', sender);
        console.log('Message ID:', messageId);
        console.log('Message Data:', messageData);
      }
    }
  } catch (error) {
    console.error('Error searching for messages:', error);
  }
}

function matchesMatchingList(
  sender: string,
  messageId: string,
  matchingList: MatchingListElement
): boolean {
  if (
    (typeof matchingList.senderAddress === 'string' &&
      matchingList.senderAddress !== '*' &&
      sender !== matchingList.senderAddress) ||
    (Array.isArray(matchingList.senderAddress) &&
      !matchingList.senderAddress.includes(sender))
  ) {
    return false;
  }
  return true;
}