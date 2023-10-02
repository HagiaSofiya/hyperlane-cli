import yargs, { CommandModule } from 'yargs';
import sendMessage from './send-message';
import { searchMessages } from './search-messages';

console.log('Raw command-line arguments:', process.argv);

const sendCommand: CommandModule = {
  command: 'send',
  describe: 'Send a message',
  builder: {
    origin: {
      describe: 'Origin chain',
      demandOption: true,
      type: 'string',
    },
    mailbox: {
      describe: 'Mailbox address',
      demandOption: true,
      type: 'string',
    },
    rpcUrl: {
      describe: 'RPC URL',
      demandOption: true,
      type: 'string',
    },
    destination: {
      describe: 'Destination chain',
      demandOption: true,
      type: 'string',
    },
    message: {
      describe: 'Arbitrary message bytes',
      demandOption: true,
      type: 'string',
    },
  },
  handler: (argv) => {
    console.log('Parsed Arguments:', argv);
    sendMessage(
      argv.origin as string,
      argv.mailbox as string,
      argv.rpcUrl as string,
      argv.destination as string,
      argv.message as string
    );
  },
};

const searchCommand: CommandModule = {
  command: 'search',
  describe: 'Search for messages',
  builder: {
    chain: {
      describe: 'Chain to search messages for',
      demandOption: true,
      type: 'string',
    },
    rpcUrl: {
      describe: 'RPC URL',
      demandOption: true,
      type: 'string',
    },
    matchingList: {
      describe: 'MatchingList JSON representation',
      type: 'string',
    },
  },
  handler: (argv) => {
    searchMessages(argv.chain as string, argv.rpcUrl as string, argv.matchingList as string);
  },
};

yargs
  .command(sendCommand)
  .command(searchCommand)
  .demandCommand()
  .help().argv;
