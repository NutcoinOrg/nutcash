# Batch Claim Merkle Distributor Tool



The following are the steps on how to use the tool (tested with Node v18.20.3):


- Install Node, check https://github.com/nodejs/help/wiki/Installation & npm.
- Add .env file to add your private key and RPC provider API key.
- Edit the batchClaim.js file to specify the cursor, txNumber and txBatchSize related to your input files (indexes, addresses, amounts, merkleProofs).
- Run `npm i && node batchClaim.js`



