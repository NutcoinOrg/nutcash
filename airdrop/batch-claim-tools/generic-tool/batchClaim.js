const ethers = require('ethers');
require("dotenv").config();
const path = require('path');
const fs = require('fs');

// Import stream modules
const { chain }  = require('stream-chain');
const { parser } = require('stream-json');
const { streamArray } = require('stream-json/streamers/StreamArray');

const dirname = path.resolve();

// Load the ABI of the NutcashMerkleDistributor contract
const nutcashMerkleDistributor = fs.readFileSync(path.join(dirname, "./NutcashMerkleDistributor.json"));
const nutcashMerkleDistributorJSON = JSON.parse(nutcashMerkleDistributor.toString()); 

// Address of the deployed NutcashMerkleDistributor contract
const nutcashMerkleDistributorAddress = '0x25559f0aBBaf2A928239D2F419181147Cc2dAd74';

// Set up the provider and wallet
const provider = new ethers.JsonRpcProvider(`https://arbitrum-mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_KEY}`);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Initialize the contract instance
const nutcashMerkleDistributorContract = new ethers.Contract(
  nutcashMerkleDistributorAddress,
  nutcashMerkleDistributorJSON.abi,
  wallet
);

const batchClaim = async (txNumber, txBatchSize, cursor) => {
  // Load the data from the JSON files (indexes, accounts, and amounts)
  const indexes = JSON.parse(fs.readFileSync(path.join(dirname, '../../merkle-indexes-input-part2.json')));
  const accounts = JSON.parse(fs.readFileSync(path.join(dirname, '../../merkle-accounts-input-part2.json')));
  const amounts = JSON.parse(fs.readFileSync(path.join(dirname, '../../merkle-amounts-input-part2.json')));
  // We will read proofs incrementally, so we don't load them here

  // Check that the arrays have the same length
  if (indexes.length !== accounts.length || accounts.length !== amounts.length) {
    throw new Error('Data arrays have inconsistent lengths');
  }

  // Ensure that cursor and requested data do not exceed array bounds
  const totalItems = indexes.length;
  const maxTxNumber = Math.ceil((totalItems - cursor) / txBatchSize);

  if (txNumber > maxTxNumber) {
    console.log(`Adjusting txNumber from ${txNumber} to ${maxTxNumber} to avoid exceeding data length`);
    txNumber = maxTxNumber;
  }

  console.log('Retrieving contract data...');
  const endTime = await nutcashMerkleDistributorContract.endTime();
  const merkleRoot = await nutcashMerkleDistributorContract.merkleRoot();
  const token = await nutcashMerkleDistributorContract.token();

  console.log(`Retrieved values are: endTime=${endTime}, merkleRoot=${merkleRoot}, token=${token}`);

  for (let i = 0; i < txNumber; i++) {
    const start = cursor + txBatchSize * i;
    const end = Math.min(cursor + txBatchSize * (i + 1), totalItems);

    const idxs = indexes.slice(start, end);
    const acts = accounts.slice(start, end);
    const amts = amounts.slice(start, end);

    console.log(`Processing batch ${i + 1} with items ${start} to ${end - 1}`);

    // Read the proofs for the current batch
    const prfs = await readProofsFromFile(start, end);

    try {
      const tx = await nutcashMerkleDistributorContract.batchClaim(idxs, acts, amts, prfs);
      await tx.wait();
      console.log('batchClaim hash: ' + tx.hash);
      console.log(`batchClaim end: #${i + 1}`);
    } catch (error) {
      console.error(`Error processing batch ${i + 1}:`, error);
      // Optionally, handle retries or exit the loop
    }
  }
};

// Function to read proofs incrementally from the large JSON file
async function readProofsFromFile(startIndex, endIndex) {
  return new Promise((resolve, reject) => {
    const proofs = [];
    let currentIndex = -1; // Index in the proofs array

    const pipeline = chain([
      fs.createReadStream(path.join(dirname, '../../merkle-merkleProofs-input-part2.json'), { encoding: 'utf8' }),
      parser(),
      streamArray(),
    ]);

    pipeline.on('data', ({ key, value }) => {
      currentIndex++;
      if (currentIndex >= startIndex && currentIndex < endIndex) {
        proofs.push(value);
      }
      if (currentIndex >= endIndex) {
        pipeline.destroy();
        resolve(proofs);
      }
    });

    pipeline.on('error', (err) => {
      reject(err);
    });

    pipeline.on('end', () => {
      if (proofs.length < (endIndex - startIndex)) {
        reject(new Error('Not enough proofs read from file'));
      } else {
        resolve(proofs);
      }
    });
  });
}

const cursor = 0; // Start index
const txNumber = 2; // Number of transactions (batches) to process
const txBatchSize = 100; // Suitable number not to exceed Arbitrum block gas limit (<=32M)

batchClaim(txNumber, txBatchSize, cursor);