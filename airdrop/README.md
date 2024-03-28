# Nutcash (NCASH) Airdrop

**Max Supply**: 21,000,000 NCASH

**Initial Supply (Airdrop)**: 10,500,000 NCASH

Initial Supply of 10.5M NCASH has been airdropped on Arbitrum (claimable) in the following way:

- **Nutcoin (NUT) - [0x473F4068073Cd5b2aB0E4Cc8E146F9EDC6fb52CC](https://etherscan.io/token/0x473f4068073cd5b2ab0e4cc8e146f9edc6fb52cc#balances)**: 2,100,000 NCASH proportionally distributed to NUT holders with the following minimum: 100M NUT 
- **Nuts (NUTS) - [0x88266f9eb705F5282a2507A9c418821a2AC9f8BD](https://etherscan.io/token/0x88266f9eb705F5282a2507A9c418821a2AC9f8BD#balances)**: 2,100,000 NCASH proportionally distributed to NUTS holders with the following minimum: 1 NUTS
- **Nuts404 (NUTS404) - [0x25559f0aBBaf2A928239D2F419181147Cc2dAd74](https://etherscan.io/token/0x25559f0abbaf2a928239d2f419181147cc2dad74#balances)**: 2,100,000 NCASH proportionally distributed to NUTS404 holders with the following minimum: 1 NUTS404 
- **Wencash (WEN) - [0xEBA6145367b33e9FB683358E0421E8b7337D435f](https://etherscan.io/token/0xeba6145367b33e9fb683358e0421e8b7337d435f#balances)**: 2,100,000 NCASH proportionally distributed to WEN holders with the following minimum: 1k WEN 
- **Large distributed & various set of Ethereum addresses**: 2,100,000 NCASH equally distributed to some token holders (check below in **Airdrop Details** the selection criteria of these addresses)

**Source files (available here)**:
 
- Snapshot of NUT Ecosystem assets: `nut-holders.csv`, `nuts-holders.csv`, `nuts404-holders.csv`, `wen-holders.csv`
- Snapshot of large distributed & various Ethereum addresses set: `export-tokenholders-for-contract-*.csv`
- Merkle distribution of NCASH: `ncash-merkle-reduced.json` (extraction reduced to addresses holding NUT ecosystem assets: NUT, NUTS, NUTS404, WEN)

## Airdrop Details

1) **Snapshot of NUT Ecosystem assets (NUT, NUTS, NUTS404, WEN)**: have been taken at Ethereum block 19451420 (~17.03.2024 01:28:02 UTC) using the following code & some post transformations using csv editors:

```code
curl -s "https://api.covalenthq.com/v1/eth-mainnet/tokens/{TOKEN_ADDRESS}/token_holders_v2/?key={API_KEY}&page-size=1000&block-height=19451420" \
    -H 'Content-Type: application/json' | \
    jq '([.data.items[].address] | "adresses," + join(",")), ([.data.items[].balance] | "balances," + join(",")) ' > ./{TOKEN_SYMBOL}.csv
```

2) **Snapshot of large, distributed & various Ethereum addresses set**: have been taken on 19.03.2024 using:

- https://etherscan.io/exportData?type=tokenholders : Extract the first 100k holders for an ERC-20 token 
- https://etherscan.io/tokens?sort=holders&order=desc : List top ERC-20 tokens by holders number 
- 100k addresses holders have been extracted for the current top19 of the above list (i.e. USDT, LPT, USDC, IOV, SHIB, MEME, G-CRE, XNN, LINK, OMG, DAI, BAT, stETH, UNI, AMB, HEX, UCASH, CRO, GSE) and for WETH ERC-20 token (which was not listed on that list despite its high holders number: >900k)

3) **Claimable delay**: ~1 year delay to claim NCASH airdrop via nutcash.org before the remaining is burnt ; timestamp limit set to: 1743524400 (Tuesday 1 April 2025 16:20:00 GMT) 

4) **Exception**: For NUT Ecosystem assets holders, all contract & exchange adresses have been excluded from the airdrop: 

**Nutcoin (NUT) holders (>=100M NUT) exception**:

- **Uniswap V2: NUT-WETH**: 0x36708B774E902cd86Ab0970B0F0cfB6c41Dc8Fb5
- **Uniswap V2: NUT-WEN**: 0xd813E7ac5bb5067Ca548e4D9bA441d95003D074f
- **MEXC: Mexc.com**: 0x75e89d5979E4f6Fba9F97c104c2F0AFB3F1dcB88
- **Uniswap V3: NUT-WETH**: 0x0ef625418Eb5ef7dA8Caf57f9E68a9fB49Fec900
- **Arbitrum One: L1 ERC20 Gateway**: 0xa3A7B6F88361F48403514059F1F16C8E78d60EeC
- **Nuts (NUTS)**: 0x88266f9eb705F5282a2507A9c418821a2AC9f8BD
- **Digifinex.com**: 0x6666827E8f2220dDf718193544889F3B482ED072
- **MEV Bot: 0x000...1d3**: 0x000000d40B595B94918a28b27d1e2C66F43A51d3
- **TransitSwap v5: Router**: 0x00000047bB99ea4D791bb749D970DE71EE0b1A34

**Nuts (NUTS) holders (>=1 NUTS) exception**:

- **Nuts404 (NUTS404)**: 0x25559f0aBBaf2A928239D2F419181147Cc2dAd74
- **Wormhole: NFT Bridge**: 0x6FFd7EdE62328b3Af38FCD61461Bbfc52F5651fE

**Nuts404 (NUTS404) holders (>=1 NUTS404) exception**:

- **Uniswap V3: NUTS404-WETH**: 0x02108AE6B0320f7A67a7C8f064c5E2dB24A1f103
- **Arbitrum One: L1 ERC20 Gateway**: 0xa3A7B6F88361F48403514059F1F16C8E78d60EeC

**Wencash (WEN) holders (>=1k WEN) exception**:

- **Uniswap V2: NUT-WEN**: 0xd813E7ac5bb5067Ca548e4D9bA441d95003D074f
- **Uniswap V2: WEN-WETH**: 0xCf4d1C0470c8E2ae8BF8160DC1c0Ac25f00BB702
- **Arbitrum One: L1 ERC20 Gateway**: 0xa3A7B6F88361F48403514059F1F16C8E78d60EeC
- **Wencash Genesis Deposit Contract**: 0xCAE7A9d478Ea404210de26952015B8F5D3B4194A

## Airdrop Using Merkle Tree 

Nutcash (NCASH) Airdrop uses `NutcashMerkleDistributor.sol` (available here) which is deployed on Arbitrum: [0x25559f0abbaf2a928239d2f419181147cc2dad74](https://arbiscan.io/address/0x25559f0abbaf2a928239d2f419181147cc2dad74#code).

This contract is based on `MerkleDistributorWithDeadline.sol` from Uniswap Merkle Distributor available in this repository: `uniswap-merkle-distributor-25a79e8`.

This Uniswap Merkle Distributor repository has been forked and adapted to Nutcash (NCASH) airdrop: scripts have been added/modified to generate Merkle Root and claims for NCASH airdrop from the csv files containing the snapshots of addresses and balances.

Script `batchClaimMerkleDistributor.ts` has also been provided here in order to call `batchClaim` function of `NutcashMerkleDistributor.sol` for the addresses holding NUT ecosystem assets. This script can be adapted/used in several different environments (e.g. Remix).

More details in [uniswap-merkle-distributor-25a79e8/README.md](uniswap-merkle-distributor-25a79e8/README.md). 