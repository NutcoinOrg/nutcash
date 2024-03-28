# @uniswap/merkle-distributor

[![Tests](https://github.com/Uniswap/merkle-distributor/workflows/Tests/badge.svg)](https://github.com/Uniswap/merkle-distributor/actions?query=workflow%3ATests)
[![Lint](https://github.com/Uniswap/merkle-distributor/workflows/Lint/badge.svg)](https://github.com/Uniswap/merkle-distributor/actions?query=workflow%3ALint)

**Repository forked from: https://github.com/Uniswap/merkle-distributor/tree/25a79e8ec8c22076a735b1a675b961c8184e7931 with the main following changes:**

- **scripts/generate-ncash-airdrop-json.ts added to convert csv files of token holders into json file showing NCASH airdrop distribution**
- **scripts/generate-merkle-root.ts modified to write Merkle claims reduced to a small set of addresses (holding NUT ecosystem assets: NUT, NUTS, NUTS404, WEN)**
- **src/parse-balance-map.ts modified for BigNumber conversions purposes**
- **package.json modified to include new script: generate-ncash-airdrop-json**

**NB: when running 'yarn run generate-ncash-airdrop-json' and 'yarn run generate-merkle-root --input ../ncash-airdrop.json', don't forget to run before 2nd script: 'set NODE_OPTIONS="--max_old_space_size=10000"' (if Windows) to avoid 'JavaScript heap out of memory' Errors (due to large set of addresses: ~2 million). Tested with node v16.20.2 & yarn v1.22.22.**

# Local Development

The following assumes the use of `node@>=10`.

## Install Dependencies

`yarn`

## Compile Contracts

`yarn compile`

## Run Tests

`yarn test`
